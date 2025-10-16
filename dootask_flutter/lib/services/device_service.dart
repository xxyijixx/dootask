import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:package_info_plus/package_info_plus.dart';

/// 设备信息服务
class DeviceService {
  final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();

  /// 获取设备信息
  Future<Map<String, dynamic>> getDeviceInfo() async {
    final packageInfo = await PackageInfo.fromPlatform();
    
    Map<String, dynamic> deviceData = {
      'platform': 'flutter',
      'appName': packageInfo.appName,
      'packageName': packageInfo.packageName,
      'version': packageInfo.version,
      'buildNumber': packageInfo.buildNumber,
    };

    if (Platform.isAndroid) {
      final androidInfo = await _deviceInfo.androidInfo;
      deviceData.addAll({
        'os': 'android',
        'osVersion': androidInfo.version.release,
        'model': androidInfo.model,
        'manufacturer': androidInfo.manufacturer,
        'brand': androidInfo.brand,
        'device': androidInfo.device,
        'sdkInt': androidInfo.version.sdkInt,
        'androidId': androidInfo.id,
      });
    } else if (Platform.isIOS) {
      final iosInfo = await _deviceInfo.iosInfo;
      deviceData.addAll({
        'os': 'ios',
        'osVersion': iosInfo.systemVersion,
        'model': iosInfo.model,
        'name': iosInfo.name,
        'systemName': iosInfo.systemName,
        'identifierForVendor': iosInfo.identifierForVendor,
      });
    }

    return deviceData;
  }
}

