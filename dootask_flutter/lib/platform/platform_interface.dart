/// 平台接口抽象
/// 为未来支持HarmonyOS等其他平台预留扩展性
abstract class PlatformInterface {
  /// 初始化平台特定功能
  Future<void> initialize();

  /// 获取平台类型
  /// 返回值: 'android', 'ios', 'harmony', 'web'
  String getPlatformType();

  /// 获取平台版本
  String getPlatformVersion();

  /// 判断是否支持某个功能
  bool isFeatureSupported(String feature);

  /// 获取平台特定配置
  Map<String, dynamic> getPlatformConfig();
}

/// 支持的功能列表
class PlatformFeatures {
  static const String camera = 'camera';
  static const String gallery = 'gallery';
  static const String fileSystem = 'file_system';
  static const String share = 'share';
  static const String notification = 'notification';
  static const String videoCall = 'video_call';
  static const String biometric = 'biometric';
  static const String location = 'location';
}

