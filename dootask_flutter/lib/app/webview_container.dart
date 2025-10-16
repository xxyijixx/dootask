import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../bridge/js_bridge.dart';
import '../bridge/vue_adapter.dart';
import '../services/web_server_service.dart';

/// WebView容器 - 应用的主界面
/// 负责加载Web应用并提供原生能力桥接
class WebViewContainer extends StatefulWidget {
  const WebViewContainer({super.key});

  @override
  State<WebViewContainer> createState() => _WebViewContainerState();
}

class _WebViewContainerState extends State<WebViewContainer> {
  late WebViewController _controller;
  bool _isLoading = true;
  double _loadingProgress = 0.0;
  final JSBridge _jsBridge = JSBridge();
  final WebServerService _webServer = WebServerService();
  String? _webUrl;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }
  
  /// 初始化应用（先启动Web服务器，再初始化WebView）
  Future<void> _initializeApp() async {
    try {
      // 启动本地Web服务器
      final url = await _webServer.start();
      setState(() {
        _webUrl = url;
      });
      
      // 初始化WebView
      _initializeWebView(url);
    } catch (e) {
      debugPrint('应用初始化失败: $e');
      // 显示错误
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Web服务器启动失败: $e')),
        );
      }
    }
  }

  /// 初始化WebView
  void _initializeWebView(String webUrl) {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      // 标识为 Flutter 套壳，便于前端通过 UA 识别
      ..setUserAgent('DooTaskFlutter/1.0 (Flutter)')
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            // 页面开始加载即注入标记，尽量让前端初始化阶段即可识别
            _controller.runJavaScript('window.isFlutterApp = true');
            setState(() {
              _isLoading = true;
              _loadingProgress = 0.0;
            });
          },
          onProgress: (int progress) {
            setState(() {
              _loadingProgress = progress / 100;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
            // 页面加载完成后注入JavaScript桥接代码
            // 再次兜底标记（保证在某些机型上可识别）
            _controller.runJavaScript('window.isFlutterApp = true');
            _injectNativeBridge();
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('WebView错误: ${error.description}');
          },
        ),
      )
      // 添加Flutter->Web的通信通道
      ..addJavaScriptChannel(
        'FlutterBridge',
        onMessageReceived: (JavaScriptMessage message) {
          _jsBridge.handleMessage(message.message, _controller);
        },
      )
      // 加载本地Web服务器
      ..loadRequest(Uri.parse(webUrl));
    
    // 设置context给JSBridge（用于打开会议界面等）
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _jsBridge.setContext(context);
      }
    });
  }

  /// 注入原生桥接代码到Web页面
  void _injectNativeBridge() {
    // 先注入URL配置替换脚本（修复 http://public/ 问题）
    _controller.runJavaScript(_getUrlReplaceScript());
    
    // 注入Flutter原生桥接
    _controller.runJavaScript(_jsBridge.getInjectedJavaScript());
    
    // 延迟注入Vue适配层，确保FlutterNative已经初始化
    Future.delayed(const Duration(milliseconds: 100), () {
      _controller.runJavaScript(VueAdapter.getAdapterScript());
    });
  }
  
  /// 获取URL替换脚本（修复config.js中的 http://public/ 问题）
  String _getUrlReplaceScript() {
    return '''
      (function() {
        // 修复 window.systemInfo 中的 URL 配置
        // 将 http://public/ 替换为实际的本地服务器地址
        if (window.systemInfo) {
          var origin = window.location.origin;
          
          // 替换 homeUrl
          if (window.systemInfo.homeUrl) {
            var homeUrl = window.systemInfo.homeUrl;
            if (homeUrl.indexOf('http://public/') === 0) {
              window.systemInfo.homeUrl = origin + '/';
            } else if (homeUrl.indexOf('./') === 0) {
              window.systemInfo.homeUrl = origin + '/';
            }
          }
          
          // 替换 apiUrl
          if (window.systemInfo.apiUrl) {
            var apiUrl = window.systemInfo.apiUrl;
            if (apiUrl.indexOf('http://public/api/') === 0) {
              window.systemInfo.apiUrl = origin + '/api/';
            } else if (apiUrl.indexOf('./api/') === 0) {
              window.systemInfo.apiUrl = origin + '/api/';
            }
          }
          
          console.log('[Flutter URL修复] homeUrl:', window.systemInfo.homeUrl);
          console.log('[Flutter URL修复] apiUrl:', window.systemInfo.apiUrl);
        }
      })();
    ''';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            // WebView内容（等待Web服务器启动）
            if (_webUrl != null)
              WebViewWidget(controller: _controller),
            
            // 加载进度条
            if (_isLoading)
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: LinearProgressIndicator(
                  value: _loadingProgress,
                  backgroundColor: Colors.grey[200],
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
                ),
              ),
            
            // 加载指示器
            if (_isLoading && _loadingProgress < 0.5)
              Center(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CircularProgressIndicator(),
                      const SizedBox(height: 16),
                      Text(
                        '加载中...',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _jsBridge.dispose();
    _webServer.stop();
    super.dispose();
  }
}

