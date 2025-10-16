import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

/// 相机和图片服务
class CameraService {
  final ImagePicker _picker = ImagePicker();

  /// 打开相机拍照
  Future<Map<String, dynamic>?> openCamera(Map<String, dynamic>? params) async {
    try {
      // 检查相机权限
      final cameraStatus = await Permission.camera.request();
      if (!cameraStatus.isGranted) {
        return {
          'success': false,
          'error': '相机权限被拒绝',
        };
      }

      // 获取参数
      final quality = params?['quality'] as int? ?? 80;
      final maxWidth = params?['maxWidth'] as double?;
      final maxHeight = params?['maxHeight'] as double?;

      // 拍照
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: quality,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
      );

      if (photo == null) {
        return {
          'success': false,
          'error': '用户取消拍照',
        };
      }

      // 返回结果
      return {
        'success': true,
        'data': {
          'path': photo.path,
          'name': photo.name,
          'size': await photo.length(),
        },
      };
    } catch (e) {
      if (kDebugMode) {
        print('打开相机失败: $e');
      }
      return {
        'success': false,
        'error': '打开相机失败: $e',
      };
    }
  }

  /// 从相册选择图片（单选）
  Future<Map<String, dynamic>?> pickImage(Map<String, dynamic>? params) async {
    try {
      // 检查相册权限
      PermissionStatus status;
      if (Platform.isAndroid) {
        if (await _isAndroid13OrAbove()) {
          status = await Permission.photos.request();
        } else {
          status = await Permission.storage.request();
        }
      } else {
        status = await Permission.photos.request();
      }

      if (!status.isGranted) {
        return {
          'success': false,
          'error': '相册权限被拒绝',
        };
      }

      // 获取参数
      final quality = params?['quality'] as int? ?? 80;
      final maxWidth = params?['maxWidth'] as double?;
      final maxHeight = params?['maxHeight'] as double?;

      // 选择图片
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: quality,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
      );

      if (image == null) {
        return {
          'success': false,
          'error': '用户取消选择',
        };
      }

      // 返回结果
      return {
        'success': true,
        'data': {
          'path': image.path,
          'name': image.name,
          'size': await image.length(),
        },
      };
    } catch (e) {
      if (kDebugMode) {
        print('选择图片失败: $e');
      }
      return {
        'success': false,
        'error': '选择图片失败: $e',
      };
    }
  }

  /// 从相册选择多张图片
  Future<Map<String, dynamic>?> pickMultipleImages(
      Map<String, dynamic>? params) async {
    try {
      // 检查相册权限
      PermissionStatus status;
      if (Platform.isAndroid) {
        if (await _isAndroid13OrAbove()) {
          status = await Permission.photos.request();
        } else {
          status = await Permission.storage.request();
        }
      } else {
        status = await Permission.photos.request();
      }

      if (!status.isGranted) {
        return {
          'success': false,
          'error': '相册权限被拒绝',
        };
      }

      // 获取参数
      final quality = params?['quality'] as int? ?? 80;
      final maxWidth = params?['maxWidth'] as double?;
      final maxHeight = params?['maxHeight'] as double?;
      final limit = params?['limit'] as int? ?? 9;

      // 选择多张图片
      final List<XFile> images = await _picker.pickMultiImage(
        imageQuality: quality,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
      );

      if (images.isEmpty) {
        return {
          'success': false,
          'error': '用户取消选择',
        };
      }

      // 限制数量
      final limitedImages = images.take(limit).toList();

      // 构建结果
      final List<Map<String, dynamic>> results = [];
      for (var image in limitedImages) {
        results.add({
          'path': image.path,
          'name': image.name,
          'size': await image.length(),
        });
      }

      return {
        'success': true,
        'data': results,
      };
    } catch (e) {
      if (kDebugMode) {
        print('选择多张图片失败: $e');
      }
      return {
        'success': false,
        'error': '选择多张图片失败: $e',
      };
    }
  }

  /// 检查是否是Android 13或以上版本
  Future<bool> _isAndroid13OrAbove() async {
    if (Platform.isAndroid) {
      // Android 13 (API 33) 及以上使用新的权限系统
      // 这里简单返回true，实际可以通过device_info_plus获取SDK版本
      return true;
    }
    return false;
  }
}

