import 'dart:io';
import 'platform_interface.dart';

/// iOS平台实现
class IOSPlatform implements PlatformInterface {
  @override
  Future<void> initialize() async {
    // iOS特定的初始化逻辑
    // 例如：配置iOS特定的SDK、服务等
  }

  @override
  String getPlatformType() {
    return 'ios';
  }

  @override
  String getPlatformVersion() {
    // 返回iOS版本
    return Platform.operatingSystemVersion;
  }

  @override
  bool isFeatureSupported(String feature) {
    // iOS支持的功能
    switch (feature) {
      case PlatformFeatures.camera:
      case PlatformFeatures.gallery:
      case PlatformFeatures.fileSystem:
      case PlatformFeatures.share:
      case PlatformFeatures.notification:
      case PlatformFeatures.videoCall:
        return true;
      default:
        return false;
    }
  }

  @override
  Map<String, dynamic> getPlatformConfig() {
    return {
      'platform': 'ios',
      'hasNavigationBar': false,
      'supportsStatusBarColor': false,
      'defaultTheme': 'cupertino',
    };
  }
}

