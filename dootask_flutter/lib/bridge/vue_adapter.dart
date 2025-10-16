/// Vue应用适配层
/// 提供给Vue应用的JavaScript适配代码
/// 这些代码将被注入到WebView中，为Vue提供Flutter原生能力的封装
class VueAdapter {
  /// 获取Vue适配层的JavaScript代码
  /// 这段代码会创建全局的适配方法，使Vue应用可以无缝调用Flutter原生能力
  static String getAdapterScript() {
    return '''
      (function() {
        // 检查是否已经初始化
        if (window.__FLUTTER_VUE_ADAPTER_INITIALIZED__) {
          return;
        }
        window.__FLUTTER_VUE_ADAPTER_INITIALIZED__ = true;
        
        console.log('[Flutter适配层] 开始初始化Vue适配层...');
        
        // 创建Vue适配对象
        window.VueFlutterAdapter = {
          isFlutterEnv: true,
          bridgeReady: false,
          
          /**
           * 打开相机拍照
           */
          async openCamera(options = {}) {
            try {
              const result = await window.FlutterNative.call('camera.open', options);
              if (result.success) {
                return result.data;
              } else {
                throw new Error(result.error || '拍照失败');
              }
            } catch (e) {
              console.error('[Flutter适配层] 拍照失败:', e);
              throw e;
            }
          },
          
          /**
           * 从相册选择图片（单选）
           */
          async pickImage(options = {}) {
            try {
              const result = await window.FlutterNative.call('image.pick', options);
              if (result.success) {
                return result.data;
              } else {
                throw new Error(result.error || '选择图片失败');
              }
            } catch (e) {
              console.error('[Flutter适配层] 选择图片失败:', e);
              throw e;
            }
          },
          
          /**
           * 从相册选择多张图片
           */
          async pickMultipleImages(options = {}) {
            try {
              const result = await window.FlutterNative.call('image.pickMultiple', options);
              if (result.success) {
                return result.data;
              } else {
                throw new Error(result.error || '选择图片失败');
              }
            } catch (e) {
              console.error('[Flutter适配层] 选择多张图片失败:', e);
              throw e;
            }
          },
          
          /**
           * 选择文件
           */
          async pickFile(options = {}) {
            try {
              const result = await window.FlutterNative.call('file.pick', options);
              if (result.success) {
                return result.data;
              } else {
                throw new Error(result.error || '选择文件失败');
              }
            } catch (e) {
              console.error('[Flutter适配层] 选择文件失败:', e);
              throw e;
            }
          },
          
          /**
           * 分享内容
           */
          async share(data) {
            try {
              const result = await window.FlutterNative.call('share.content', data);
              if (result && !result.success) {
                throw new Error(result.error || '分享失败');
              }
            } catch (e) {
              console.error('[Flutter适配层] 分享失败:', e);
              throw e;
            }
          },
          
          /**
           * 分享文本
           */
          async shareText(text, subject) {
            return await this.share({
              type: 'text',
              text: text,
              subject: subject
            });
          },
          
          /**
           * 分享图片
           */
          async shareImage(imagePath, text) {
            return await this.share({
              type: 'files',
              files: [imagePath],
              text: text
            });
          },
          
          /**
           * 分享文件
           */
          async shareFile(filePath, text) {
            const files = Array.isArray(filePath) ? filePath : [filePath];
            return await this.share({
              type: 'files',
              files: files,
              text: text
            });
          },
          
          /**
           * 获取设备信息
           */
          async getDeviceInfo() {
            try {
              const result = await window.FlutterNative.call('device.getInfo');
              return result.success ? result.data : result;
            } catch (e) {
              console.error('[Flutter适配层] 获取设备信息失败:', e);
              throw e;
            }
          },
          
          /**
           * 启动视频会议
           */
          async startMeeting(params) {
            try {
              const result = await window.FlutterNative.call('meeting.start', params);
              if (result && !result.success) {
                throw new Error(result.error || '启动会议失败');
              }
            } catch (e) {
              console.error('[Flutter适配层] 启动会议失败:', e);
              throw e;
            }
          },
          
          /**
           * 设置推送别名（登录后调用）
           */
          async setPushAlias(userId) {
            try {
              const result = await window.FlutterNative.call('notification.setAlias', {
                userId: userId
              });
              if (result && !result.success) {
                console.warn('[Flutter适配层] 设置推送别名失败:', result.error);
              }
            } catch (e) {
              console.error('[Flutter适配层] 设置推送别名失败:', e);
            }
          },
          
          /**
           * 移除推送别名（退出登录时调用）
           */
          async removePushAlias() {
            try {
              const result = await window.FlutterNative.call('notification.removeAlias');
              if (result && !result.success) {
                console.warn('[Flutter适配层] 移除推送别名失败:', result.error);
              }
            } catch (e) {
              console.error('[Flutter适配层] 移除推送别名失败:', e);
            }
          },
          
          /**
           * 测试Flutter桥接
           */
          async testBridge(message = 'Hello Flutter') {
            try {
              const result = await window.FlutterNative.call('test.echo', {
                message: message
              });
              console.log('[Flutter适配层] 测试成功:', result);
              return result;
            } catch (e) {
              console.error('[Flutter适配层] 测试失败:', e);
              throw e;
            }
          }
        };
        
        // 等待Flutter桥接就绪
        window.addEventListener('flutterBridgeReady', function() {
          window.VueFlutterAdapter.bridgeReady = true;
          console.log('[Flutter适配层] Flutter桥接已就绪');
          
          // 触发自定义事件，通知Vue应用
          window.dispatchEvent(new CustomEvent('vueFlutterAdapterReady', {
            detail: {
              platform: 'flutter',
              version: '1.3.15'
            }
          }));
        });
        
        // 如果Flutter桥接已经准备好了，立即触发
        if (window.FlutterNative) {
          window.VueFlutterAdapter.bridgeReady = true;
          setTimeout(function() {
            window.dispatchEvent(new CustomEvent('vueFlutterAdapterReady', {
              detail: {
                platform: 'flutter',
                version: '1.3.15'
              }
            }));
          }, 0);
        }
        
        console.log('[Flutter适配层] Vue适配层初始化完成');
      })();
    ''';
  }
}

