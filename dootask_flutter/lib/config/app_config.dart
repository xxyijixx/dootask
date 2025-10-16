import 'package:flutter/foundation.dart';

/// 应用配置
class AppConfig {
  // 根据构建模式判断环境
  static const bool isDevelopment = kDebugMode;
  
  /// API服务器地址
  /// 注意：修改为你的实际API服务器地址
  static String get apiBaseUrl {
    if (isDevelopment) {
      // 开发环境：本地API服务器
      return 'https://demo.dootask.com/';
    } else {
      // 生产环境：远程API服务器
      return 'https://your-dootask-api.com/';
    }
  }
  
  /// Web应用URL
  /// 注意：现在使用Flutter内置的本地Web服务器
  /// 在WebViewContainer中动态获取
  static String webAppUrl = 'http://127.0.0.1:8080';
  
  /// 应用版本
  static const String appVersion = '1.3.15';
  
  /// 应用名称
  static const String appName = 'DooTask';
  
  /// 调试模式
  static const bool debugMode = kDebugMode;
  
  /// WebView调试
  static const bool webViewDebug = kDebugMode;
  
  /// 请求超时时间（秒）
  static const int requestTimeout = 30;
  
  /// 文件上传最大大小（MB）
  static const int maxUploadSize = 100;
}
