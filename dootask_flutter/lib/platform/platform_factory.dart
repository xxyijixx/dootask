import 'dart:io';
import 'platform_interface.dart';
import 'platform_android.dart';
import 'platform_ios.dart';

/// 平台工厂
/// 根据当前运行平台返回对应的平台实现
class PlatformFactory {
  static PlatformInterface? _instance;

  /// 获取当前平台实例
  static PlatformInterface get instance {
    _instance ??= _createPlatform();
    return _instance!;
  }

  /// 创建平台实例
  static PlatformInterface _createPlatform() {
    if (Platform.isAndroid) {
      return AndroidPlatform();
    } else if (Platform.isIOS) {
      return IOSPlatform();
    }
    // 未来可以添加HarmonyOS支持
    // else if (isHarmonyOS()) {
    //   return HarmonyPlatform();
    // }
    
    throw UnsupportedError('Unsupported platform: ${Platform.operatingSystem}');
  }

  /// 检查是否是HarmonyOS（预留）
  /// 注意：这需要通过特定的方法检测，例如检查系统属性
  static bool isHarmonyOS() {
    // 待实现：检测HarmonyOS的逻辑
    // 可能需要使用method channel调用原生代码检测
    return false;
  }
}

