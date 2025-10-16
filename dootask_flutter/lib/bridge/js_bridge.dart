import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../models/bridge_message.dart';
import '../services/device_service.dart';
import '../services/camera_service.dart';
import '../services/file_service.dart';
import '../services/share_service.dart';
import '../services/notification_service.dart';
import '../services/meeting_service.dart';
import '../screens/meeting_screen.dart';

/// JavaScript桥接管理器
/// 负责处理Flutter与WebView之间的通信
class JSBridge {
  final DeviceService _deviceService = DeviceService();
  final CameraService _cameraService = CameraService();
  final FileService _fileService = FileService();
  final ShareService _shareService = ShareService();
  final NotificationService _notificationService = NotificationService();
  final MeetingService _meetingService = MeetingService();

  BuildContext? _context;

  /// 设置上下文（用于打开会议界面）
  void setContext(BuildContext context) {
    _context = context;
  }

  /// 处理来自Web的消息
  Future<void> handleMessage(
    String message,
    WebViewController controller,
  ) async {
    try {
      // 解析消息
      final jsonData = json.decode(message);
      final bridgeMessage = BridgeMessage.fromJson(jsonData);

      if (kDebugMode) {
        print('收到桥接消息: ${bridgeMessage.method}');
      }

      dynamic result;

      // 根据方法名分发到对应的服务
      switch (bridgeMessage.method) {
        case 'test.echo':
          // 测试回显
          result = bridgeMessage.params;
          break;

        case 'device.getInfo':
          // 获取设备信息
          result = await _deviceService.getDeviceInfo();
          break;

        // 相机和图片服务
        case 'camera.open':
          result = await _cameraService.openCamera(bridgeMessage.params);
          break;

        case 'image.pick':
          result = await _cameraService.pickImage(bridgeMessage.params);
          break;

        case 'image.pickMultiple':
          result = await _cameraService.pickMultipleImages(bridgeMessage.params);
          break;

        // 文件操作服务
        case 'file.pick':
          result = await _fileService.pickFile(bridgeMessage.params);
          break;

        case 'file.open':
          result = await _fileService.openFile(bridgeMessage.params);
          break;

        case 'file.getInfo':
          result = await _fileService.getFileInfo(bridgeMessage.params);
          break;

        // 分享服务
        case 'share.content':
          result = await _shareService.share(bridgeMessage.params!);
          break;

        case 'share.text':
          result = await _shareService.shareText(bridgeMessage.params!);
          break;

        case 'share.image':
          result = await _shareService.shareImage(bridgeMessage.params!);
          break;

        case 'share.file':
          result = await _shareService.shareFile(bridgeMessage.params!);
          break;

        // 推送通知服务
        case 'notification.setAlias':
          result = await _notificationService.setAlias(
            bridgeMessage.params?['userId'],
          );
          break;

        case 'notification.removeAlias':
          result = await _notificationService.removeAlias();
          break;

        case 'notification.setBadge':
          result = await _notificationService.setBadge(
            bridgeMessage.params?['count'] as int? ?? 0,
          );
          break;

        // 视频会议服务
        case 'meeting.start':
          if (_context != null) {
            result = await _startMeeting(_context!, bridgeMessage.params!);
          } else {
            result = {
              'success': false,
              'error': '无法启动会议：上下文未初始化',
            };
          }
          break;

        case 'meeting.leave':
          result = await _meetingService.leaveMeeting();
          break;

        default:
          if (kDebugMode) {
            print('未知方法: ${bridgeMessage.method}');
          }
          // 对未知方法返回错误
          if (bridgeMessage.requestId != null) {
            _sendErrorToWeb(
              controller,
              bridgeMessage.requestId,
              '未知方法: ${bridgeMessage.method}',
            );
          }
          return;
      }

      // 如果有requestId，返回结果到Web
      if (bridgeMessage.requestId != null) {
        _sendResultToWeb(controller, bridgeMessage.requestId, result);
      }
    } catch (e) {
      if (kDebugMode) {
        print('处理桥接消息错误: $e');
      }
    }
  }

  /// 发送成功结果回Web页面
  void _sendResultToWeb(
    WebViewController controller,
    dynamic requestId,
    dynamic result,
  ) {
    final response = BridgeResponse.success(data: result);
    final resultJson = json.encode(response.toJson());
    
    controller.runJavaScript('''
      (function() {
        if (window['_callback_$requestId']) {
          window['_callback_$requestId']($resultJson);
          delete window['_callback_$requestId'];
          delete window['_error_$requestId'];
        }
      })();
    ''');
  }

  /// 发送错误结果回Web页面
  void _sendErrorToWeb(
    WebViewController controller,
    dynamic requestId,
    String error,
  ) {
    final response = BridgeResponse.error(error);
    final errorJson = json.encode(response.toJson());
    
    controller.runJavaScript('''
      (function() {
        if (window['_error_$requestId']) {
          window['_error_$requestId'](new Error($errorJson));
          delete window['_callback_$requestId'];
          delete window['_error_$requestId'];
        }
      })();
    ''');
  }

  /// 获取需要注入到WebView的JavaScript代码
  String getInjectedJavaScript() {
    return '''
      (function() {
        // 创建全局Flutter原生桥接对象
        window.FlutterNative = {
          // 调用原生能力
          call: function(method, params) {
            return new Promise(function(resolve, reject) {
              const requestId = Date.now() + '_' + Math.random();
              window['_callback_' + requestId] = resolve;
              window['_error_' + requestId] = reject;
              
              try {
                FlutterBridge.postMessage(JSON.stringify({
                  method: method,
                  requestId: requestId,
                  params: params || {}
                }));
              } catch (e) {
                reject(e);
                delete window['_callback_' + requestId];
                delete window['_error_' + requestId];
              }
              
              // 超时处理（30秒）
              setTimeout(function() {
                if (window['_callback_' + requestId]) {
                  delete window['_callback_' + requestId];
                  delete window['_error_' + requestId];
                  reject(new Error('Native call timeout'));
                }
              }, 30000);
            });
          }
        };
        
        // 通知Vue应用桥接已准备好
        window.dispatchEvent(new Event('flutterBridgeReady'));
        
        console.log('Flutter Native Bridge initialized');
      })();
    ''';
  }

  /// 启动会议
  Future<Map<String, dynamic>> _startMeeting(
    BuildContext context,
    Map<String, dynamic> params,
  ) async {
    try {
      // 先调用服务启动会议
      final result = await _meetingService.startMeeting(params);
      
      if (result?['success'] == true) {
        // 打开会议界面
        final channelId = params['channelId'] as String;
        final uid = params['uid'] as int? ?? 0;
        
        // 在主线程中打开会议界面
        if (context.mounted) {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => MeetingScreen(
                channelId: channelId,
                uid: uid,
              ),
            ),
          );
        }
      }
      
      return result ?? {'success': false, 'error': '未知错误'};
    } catch (e) {
      return {
        'success': false,
        'error': '启动会议失败: $e',
      };
    }
  }

  /// 释放资源
  void dispose() {
    _meetingService.dispose();
  }
}

