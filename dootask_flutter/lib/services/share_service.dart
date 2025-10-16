import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:share_plus/share_plus.dart';

/// 分享服务
class ShareService {
  /// 分享内容（文本、图片或文件）
  Future<Map<String, dynamic>?> share(Map<String, dynamic> params) async {
    try {
      final type = params['type'] as String?;
      final text = params['text'] as String?;
      final files = params['files'] as List<dynamic>?;
      final subject = params['subject'] as String?;

      if (type == 'text') {
        // 分享文本
        if (text == null || text.isEmpty) {
          return {
            'success': false,
            'error': '分享内容不能为空',
          };
        }

        await Share.share(
          text,
          subject: subject,
        );

        return {
          'success': true,
        };
      } else if (type == 'files') {
        // 分享文件
        if (files == null || files.isEmpty) {
          return {
            'success': false,
            'error': '没有要分享的文件',
          };
        }

        // 转换为XFile列表
        final List<XFile> xFiles = [];
        for (var filePath in files) {
          if (filePath is String && filePath.isNotEmpty) {
            final file = File(filePath);
            if (await file.exists()) {
              xFiles.add(XFile(filePath));
            }
          }
        }

        if (xFiles.isEmpty) {
          return {
            'success': false,
            'error': '没有有效的文件',
          };
        }

        await Share.shareXFiles(
          xFiles,
          text: text,
          subject: subject,
        );

        return {
          'success': true,
        };
      } else {
        return {
          'success': false,
          'error': '不支持的分享类型',
        };
      }
    } catch (e) {
      if (kDebugMode) {
        print('分享失败: $e');
      }
      return {
        'success': false,
        'error': '分享失败: $e',
      };
    }
  }

  /// 分享文本
  Future<Map<String, dynamic>?> shareText(Map<String, dynamic> params) async {
    return await share({
      'type': 'text',
      'text': params['text'],
      'subject': params['subject'],
    });
  }

  /// 分享图片
  Future<Map<String, dynamic>?> shareImage(Map<String, dynamic> params) async {
    return await share({
      'type': 'files',
      'files': [params['path']],
      'text': params['text'],
    });
  }

  /// 分享文件
  Future<Map<String, dynamic>?> shareFile(Map<String, dynamic> params) async {
    return await share({
      'type': 'files',
      'files': [params['path']],
      'text': params['text'],
    });
  }
}

