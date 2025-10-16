import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:file_picker/file_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:url_launcher/url_launcher.dart';

/// 文件操作服务
class FileService {
  /// 选择文件
  Future<Map<String, dynamic>?> pickFile(Map<String, dynamic>? params) async {
    try {
      // 检查存储权限
      if (Platform.isAndroid) {
        final status = await Permission.storage.request();
        if (!status.isGranted) {
          return {
            'success': false,
            'error': '存储权限被拒绝',
          };
        }
      }

      // 获取参数
      final type = params?['type'] as String?;
      final allowMultiple = params?['allowMultiple'] as bool? ?? false;
      final allowedExtensions = params?['allowedExtensions'] as List<String>?;

      // 确定文件类型
      FileType fileType = FileType.any;
      if (type == 'image') {
        fileType = FileType.image;
      } else if (type == 'video') {
        fileType = FileType.video;
      } else if (type == 'audio') {
        fileType = FileType.audio;
      } else if (type == 'custom' && allowedExtensions != null) {
        fileType = FileType.custom;
      }

      // 选择文件
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: fileType,
        allowMultiple: allowMultiple,
        allowedExtensions:
            fileType == FileType.custom ? allowedExtensions : null,
      );

      if (result == null) {
        return {
          'success': false,
          'error': '用户取消选择',
        };
      }

      // 构建结果
      if (allowMultiple) {
        final List<Map<String, dynamic>> files = [];
        for (var file in result.files) {
          files.add({
            'path': file.path,
            'name': file.name,
            'size': file.size,
            'extension': file.extension,
          });
        }
        return {
          'success': true,
          'data': files,
        };
      } else {
        final file = result.files.first;
        return {
          'success': true,
          'data': {
            'path': file.path,
            'name': file.name,
            'size': file.size,
            'extension': file.extension,
          },
        };
      }
    } catch (e) {
      if (kDebugMode) {
        print('选择文件失败: $e');
      }
      return {
        'success': false,
        'error': '选择文件失败: $e',
      };
    }
  }

  /// 打开文件（使用系统默认应用）
  Future<Map<String, dynamic>?> openFile(Map<String, dynamic>? params) async {
    try {
      final filePath = params?['path'] as String?;
      if (filePath == null || filePath.isEmpty) {
        return {
          'success': false,
          'error': '文件路径不能为空',
        };
      }

      final file = File(filePath);
      if (!await file.exists()) {
        return {
          'success': false,
          'error': '文件不存在',
        };
      }

      // 使用系统应用打开文件
      final uri = Uri.file(filePath);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
        return {
          'success': true,
        };
      } else {
        return {
          'success': false,
          'error': '无法打开文件',
        };
      }
    } catch (e) {
      if (kDebugMode) {
        print('打开文件失败: $e');
      }
      return {
        'success': false,
        'error': '打开文件失败: $e',
      };
    }
  }

  /// 获取文件信息
  Future<Map<String, dynamic>?> getFileInfo(
      Map<String, dynamic>? params) async {
    try {
      final filePath = params?['path'] as String?;
      if (filePath == null || filePath.isEmpty) {
        return {
          'success': false,
          'error': '文件路径不能为空',
        };
      }

      final file = File(filePath);
      if (!await file.exists()) {
        return {
          'success': false,
          'error': '文件不存在',
        };
      }

      final stat = await file.stat();
      final fileName = file.path.split('/').last;

      return {
        'success': true,
        'data': {
          'path': file.path,
          'name': fileName,
          'size': stat.size,
          'modified': stat.modified.toIso8601String(),
          'type': stat.type.toString(),
        },
      };
    } catch (e) {
      if (kDebugMode) {
        print('获取文件信息失败: $e');
      }
      return {
        'success': false,
        'error': '获取文件信息失败: $e',
      };
    }
  }
}

