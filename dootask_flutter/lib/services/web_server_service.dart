import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:shelf/shelf.dart' as shelf;
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_web_socket/shelf_web_socket.dart' as shelf_ws;
import 'package:mime/mime.dart';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';
import '../config/app_config.dart';

/// 本地Web服务器服务
/// 用于在Flutter中启动HTTP服务器，serve electron/public的静态资源
class WebServerService {
  HttpServer? _server;
  int _port = 8080;
  String? _serverUrl;
  String? _apiBaseUrl;

  /// 获取服务器URL
  String? get serverUrl => _serverUrl;

  /// 设置API服务器地址
  void setApiBaseUrl(String url) {
    _apiBaseUrl = url.endsWith('/') ? url : '$url/';
    debugPrint('API服务器地址已设置: $_apiBaseUrl');
  }

  /// 启动Web服务器
  Future<String> start({String? apiBaseUrl}) async {
    if (_server != null) {
      debugPrint('Web服务器已经在运行: $_serverUrl');
      return _serverUrl!;
    }

    try {
      // 设置API服务器地址
      _apiBaseUrl = apiBaseUrl ?? AppConfig.apiBaseUrl;
      if (!_apiBaseUrl!.endsWith('/')) {
        _apiBaseUrl = '$_apiBaseUrl/';
      }
      debugPrint('API服务器地址: $_apiBaseUrl');
      
      // 查找可用端口
      _port = await _findAvailablePort();
      
      // 创建请求处理器
      final handler = shelf.Cascade()
          .add(_createAssetHandler())
          .handler;

      // 启动服务器
      _server = await shelf_io.serve(
        handler,
        InternetAddress.loopbackIPv4,
        _port,
      );

      _serverUrl = 'http://127.0.0.1:$_port';
      
      debugPrint('✅ Web服务器启动成功: $_serverUrl');
      return _serverUrl!;
    } catch (e) {
      debugPrint('❌ Web服务器启动失败: $e');
      rethrow;
    }
  }

  /// 停止Web服务器
  Future<void> stop() async {
    if (_server != null) {
      await _server!.close(force: true);
      _server = null;
      _serverUrl = null;
      debugPrint('Web服务器已停止');
    }
  }

  /// 创建资源处理器
  shelf.Handler _createAssetHandler() {
    return (shelf.Request request) async {
      try {
        // 解析请求路径
        var requestPath = request.url.path;

        // WebSocket请求处理 - 转发到后端服务器
        if (requestPath == 'ws') {
          return await _proxyWebSocketRequest(request);
        }

        // API请求处理 - 转发到后端服务器
        if (requestPath.startsWith('api/')) {
          return await _proxyApiRequest(request);
        }
        
        // 如果是根路径，重定向到index.html
        if (requestPath.isEmpty || requestPath == '/') {
          requestPath = 'index.html';
        }

        // 构建assets路径
        final assetPath = 'public/$requestPath';
        
        debugPrint('请求: ${request.url.path} -> $assetPath');

        // 加载资源
        final data = await rootBundle.load(assetPath);
        final bytes = data.buffer.asUint8List();

        // 获取MIME类型
        final mimeType = lookupMimeType(requestPath) ?? 'application/octet-stream';

        // 返回响应
        return shelf.Response.ok(
          bytes,
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Access-Control-Allow-Origin': '*',
          },
        );
      } catch (e) {
        debugPrint('资源加载失败: ${request.url.path} - $e');
        
        // 如果是HTML请求失败，返回index.html
        if (request.url.path.endsWith('.html') || 
            !request.url.path.contains('.')) {
          try {
            final data = await rootBundle.load('public/index.html');
            final bytes = data.buffer.asUint8List();
            return shelf.Response.ok(
              bytes,
              headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache',
              },
            );
          } catch (e2) {
            debugPrint('加载index.html失败: $e2');
          }
        }
        
        return shelf.Response.notFound('Resource not found: ${request.url.path}');
      }
    };
  }

  /// 代理API请求到后端服务器
  Future<shelf.Response> _proxyApiRequest(shelf.Request request) async {
    try {
      final apiUrl = '$_apiBaseUrl${request.url.path}';
      final queryParams = request.url.query;
      final fullUrl = queryParams.isEmpty ? apiUrl : '$apiUrl?$queryParams';
      
      debugPrint('API代理: ${request.method} ${request.url.path} -> $fullUrl');

      // 读取请求体
      final bodyBytes = await request.read().toList();
      final body = bodyBytes.expand((x) => x).toList();
      
      // 复制请求头
      final headers = <String, String>{};
      request.headers.forEach((key, value) {
        if (!_shouldSkipHeader(key)) {
          headers[key] = value;
        }
      });

      // 处理OPTIONS预检请求
      if (request.method == 'OPTIONS') {
        return shelf.Response.ok(
          '',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400',
          },
        );
      }

      // 发送代理请求
      http.Response response;
      
      switch (request.method) {
        case 'GET':
          response = await http.get(
            Uri.parse(fullUrl),
            headers: headers,
          ).timeout(Duration(seconds: AppConfig.requestTimeout));
          break;
          
        case 'POST':
          response = await http.post(
            Uri.parse(fullUrl),
            headers: headers,
            body: body,
          ).timeout(Duration(seconds: AppConfig.requestTimeout));
          break;
          
        case 'PUT':
          response = await http.put(
            Uri.parse(fullUrl),
            headers: headers,
            body: body,
          ).timeout(Duration(seconds: AppConfig.requestTimeout));
          break;
          
        case 'DELETE':
          response = await http.delete(
            Uri.parse(fullUrl),
            headers: headers,
          ).timeout(Duration(seconds: AppConfig.requestTimeout));
          break;
          
        default:
          return shelf.Response(405, body: 'Method Not Allowed');
      }

      // 复制响应头
      final responseHeaders = <String, String>{};
      response.headers.forEach((key, value) {
        if (!_shouldSkipHeader(key)) {
          responseHeaders[key] = value;
        }
      });
      
      // 添加CORS头
      responseHeaders['Access-Control-Allow-Origin'] = '*';
      responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      responseHeaders['Access-Control-Allow-Headers'] = '*';

      debugPrint('API响应: ${response.statusCode} ${response.body.length} bytes');

      return shelf.Response(
        response.statusCode,
        body: response.bodyBytes,
        headers: responseHeaders,
      );
    } catch (e) {
      debugPrint('API代理失败: $e');
      return shelf.Response.internalServerError(
        body: '{"ret":0,"msg":"API请求失败: $e"}',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      );
    }
  }

  /// 代理WebSocket请求到后端服务器
  Future<shelf.Response> _proxyWebSocketRequest(shelf.Request request) async {
    try {
      // 检查是否是WebSocket升级请求
      final connection = request.headers['connection']?.toLowerCase();
      final upgrade = request.headers['upgrade']?.toLowerCase();

      if (connection != 'upgrade' || upgrade != 'websocket') {
        return shelf.Response.badRequest(body: 'Invalid WebSocket upgrade request');
      }

      // 构建后端WebSocket URL
      final backendWsUrl = _apiBaseUrl!.replaceFirst('http', 'ws').replaceFirst('https', 'wss');
      final wsUrl = '$backendWsUrl${request.url.path}';
      final queryParams = request.url.query;
      final fullWsUrl = queryParams.isEmpty ? wsUrl : '$wsUrl?$queryParams';

      debugPrint('WebSocket代理: ${request.method} ${request.url.path} -> $fullWsUrl');

      // 创建WebSocket处理器
      final wsHandler = shelf_ws.webSocketHandler((WebSocketChannel clientChannel) async {
        try {
          // 连接到后端WebSocket服务器
          final backendChannel = IOWebSocketChannel.connect(fullWsUrl);

          // 双向转发消息
          clientChannel.stream.listen(
            (message) {
              debugPrint('客户端 -> 后端: $message');
              backendChannel.sink.add(message);
            },
            onDone: () {
              debugPrint('客户端连接关闭');
              backendChannel.sink.close();
            },
            onError: (error) {
              debugPrint('客户端连接错误: $error');
              backendChannel.sink.close();
            },
          );

          backendChannel.stream.listen(
            (message) {
              debugPrint('后端 -> 客户端: $message');
              clientChannel.sink.add(message);
            },
            onDone: () {
              debugPrint('后端连接关闭');
              clientChannel.sink.close();
            },
            onError: (error) {
              debugPrint('后端连接错误: $error');
              clientChannel.sink.close();
            },
          );
        } catch (e) {
          debugPrint('WebSocket代理连接失败: $e');
          clientChannel.sink.close();
        }
      });

      // 调用WebSocket处理器
      return await wsHandler(request);
    } catch (e) {
      debugPrint('WebSocket代理失败: $e');
      return shelf.Response.internalServerError(body: 'WebSocket proxy failed: $e');
    }
  }

  /// 判断是否应该跳过某个请求头
  bool _shouldSkipHeader(String key) {
    final lowerKey = key.toLowerCase();
    return lowerKey == 'host' || 
           lowerKey == 'connection' || 
           lowerKey == 'content-length' ||
           lowerKey == 'transfer-encoding';
  }

  /// 查找可用端口
  Future<int> _findAvailablePort() async {
    int port = 8080;
    
    while (port < 9000) {
      try {
        final server = await ServerSocket.bind(
          InternetAddress.loopbackIPv4,
          port,
        );
        await server.close();
        return port;
      } catch (e) {
        port++;
      }
    }
    
    throw Exception('无法找到可用端口');
  }
}

