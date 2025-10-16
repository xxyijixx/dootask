# DooTask Flutter 迁移版本

DooTask移动端的Flutter实现，采用WebView方案，Flutter仅作为原生容器，所有业务逻辑保留在Vue应用中。

## 架构说明

```
Flutter Native Shell（容器层）
  ├── WebView容器 - 显示Vue应用
  ├── JavaScript Bridge - 通信桥接
  └── Native Services - 原生能力
      ├── 相机和图片服务
      ├── 文件操作服务
      ├── 分享服务
      ├── 推送通知服务（友盟）
      ├── 视频会议服务（Agora）
      └── 设备信息服务

Vue Application（业务层）
  └── 通过WebView加载，所有业务逻辑保持不变
```

## 环境要求

- Flutter SDK: >=3.0.0
- Dart SDK: >=3.0.0
- Android: API 21+ (Android 5.0+)
- iOS: iOS 12.0+
- Vue应用运行在: http://localhost:22223

## 快速开始

### 1. 安装依赖

```bash
cd dootask_flutter
flutter pub get
```

### 2. 运行应用

**Android:**
```bash
flutter run -d android
```

**iOS:**
```bash
flutter run -d ios
```

**注意**: 在运行Flutter应用之前，确保Vue应用已经启动在 http://localhost:22223

### 3. 构建发布版本

**Android APK:**
```bash
flutter build apk --release
```

**iOS:**
```bash
flutter build ios --release
# 然后在Xcode中打开项目进行归档
```

## Vue应用集成说明

Flutter会自动向WebView注入 `window.VueFlutterAdapter` 对象，Vue应用可以直接使用。

### 在Vue中使用原生能力

```javascript
// 1. 监听Flutter适配层就绪
window.addEventListener('vueFlutterAdapterReady', (event) => {
  console.log('Flutter适配层已就绪:', event.detail);
});

// 2. 检查是否在Flutter环境
if (window.VueFlutterAdapter) {
  console.log('当前在Flutter环境中');
}

// 3. 使用原生能力示例

// 打开相机拍照
const photo = await window.VueFlutterAdapter.openCamera({
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080
});
console.log('照片路径:', photo.path);

// 从相册选择图片
const image = await window.VueFlutterAdapter.pickImage({
  quality: 90
});

// 选择多张图片
const images = await window.VueFlutterAdapter.pickMultipleImages({
  quality: 80,
  limit: 9
});

// 选择文件
const file = await window.VueFlutterAdapter.pickFile({
  type: 'any',  // 'image', 'video', 'audio', 'any'
  allowMultiple: false
});

// 分享文本
await window.VueFlutterAdapter.shareText('分享的内容', '主题');

// 分享图片
await window.VueFlutterAdapter.shareImage('/path/to/image.jpg', '附加文本');

// 分享文件
await window.VueFlutterAdapter.shareFile(['/path/to/file1.pdf', '/path/to/file2.doc']);

// 获取设备信息
const deviceInfo = await window.VueFlutterAdapter.getDeviceInfo();
console.log('设备信息:', deviceInfo);

// 设置推送别名（登录后）
await window.VueFlutterAdapter.setPushAlias('user_12345');

// 移除推送别名（退出登录）
await window.VueFlutterAdapter.removePushAlias();

// 测试桥接
const result = await window.VueFlutterAdapter.testBridge('Hello');
console.log('测试结果:', result);
```

### 与eeui兼容的写法

```javascript
// 检测环境并调用相应API
async function openCamera() {
  if (window.VueFlutterAdapter && window.VueFlutterAdapter.bridgeReady) {
    // Flutter环境
    return await window.VueFlutterAdapter.openCamera({ quality: 80 });
  } else if (window.eeui) {
    // eeui环境（降级方案）
    return await window.eeui.openCamera({ quality: 80 });
  } else {
    throw new Error('相机功能不可用');
  }
}
```

## 支持的原生能力

### 相机和图片
- ✅ `openCamera(options)` - 打开相机拍照
- ✅ `pickImage(options)` - 选择单张图片
- ✅ `pickMultipleImages(options)` - 选择多张图片

### 文件操作
- ✅ `pickFile(options)` - 选择文件

### 分享
- ✅ `share(data)` - 分享内容
- ✅ `shareText(text, subject)` - 分享文本
- ✅ `shareImage(path, text)` - 分享图片
- ✅ `shareFile(path, text)` - 分享文件

### 设备信息
- ✅ `getDeviceInfo()` - 获取设备信息

### 推送通知（友盟）
- ⏳ `setPushAlias(userId)` - 设置推送别名
- ⏳ `removePushAlias()` - 移除推送别名

### 视频会议（Agora）
- ⏳ `startMeeting(params)` - 启动视频会议

## 项目结构

```
lib/
├── main.dart                       # 应用入口
├── app/
│   └── webview_container.dart      # WebView容器
├── bridge/
│   ├── js_bridge.dart              # JavaScript桥接管理
│   └── vue_adapter.dart            # Vue适配层
├── services/
│   ├── camera_service.dart         # 相机服务
│   ├── file_service.dart           # 文件操作
│   ├── share_service.dart          # 分享服务
│   ├── device_service.dart         # 设备信息
│   ├── notification_service.dart   # 推送服务（待实现）
│   └── meeting_service.dart        # 视频会议（待实现）
├── models/
│   └── bridge_message.dart         # 消息模型
└── platform/                       # 平台抽象层（为HarmonyOS预留）
    ├── platform_interface.dart
    ├── platform_android.dart
    └── platform_ios.dart
```

## 权限说明

### Android权限
- `INTERNET` - 网络访问
- `CAMERA` - 相机
- `READ_EXTERNAL_STORAGE` - 读取存储
- `WRITE_EXTERNAL_STORAGE` - 写入存储
- `RECORD_AUDIO` - 录音（视频会议）

### iOS权限
- `NSCameraUsageDescription` - 相机使用说明
- `NSPhotoLibraryUsageDescription` - 相册访问说明
- `NSMicrophoneUsageDescription` - 麦克风使用说明
- `NSLocalNetworkUsageDescription` - 本地网络访问

## 构建配置

### Android签名

编辑 `android/key.properties`:
```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=your_key_alias
storeFile=path/to/keystore.jks
```

### iOS配置

在Xcode中配置：
1. Bundle Identifier: `com.dootask.task`
2. 开发者证书
3. 推送通知证书
4. 版本号: `1.3.15 (212)`

## 调试技巧

### 查看WebView控制台日志

**Android:**
```bash
adb logcat | grep -i "console"
```

**iOS:**
在Safari中打开 "开发" -> "模拟器" -> 选择WebView

### Flutter日志
```bash
flutter logs
```

### 测试桥接通信
在Chrome DevTools中执行：
```javascript
await window.VueFlutterAdapter.testBridge('测试消息');
```

## 常见问题

### Q: WebView无法加载Vue应用？
A: 确保Vue应用运行在 http://localhost:22223，并且设备可以访问该地址。

### Q: 相机/相册权限被拒绝？
A: 检查 AndroidManifest.xml 和 Info.plist 中的权限配置是否正确。

### Q: 如何在生产环境使用？
A: 修改 `lib/app/webview_container.dart` 中的URL为生产环境地址。

### Q: 如何调试JavaScript错误？
A: 启用WebView的调试模式，使用Chrome DevTools连接。

## 待实现功能

- [ ] 友盟推送通知集成
- [ ] Agora视频会议集成
- [ ] WebView缓存优化
- [ ] 启动画面优化
- [ ] HarmonyOS支持

## 版本历史

### v1.3.15+212 (当前版本)
- ✅ Flutter项目初始化
- ✅ WebView容器实现
- ✅ JavaScript桥接框架
- ✅ 相机和图片服务
- ✅ 文件操作服务
- ✅ 分享服务
- ✅ 设备信息服务
- ✅ Vue适配层

## 许可证

MIT License

## 联系方式

- 项目地址: https://github.com/kuaifan/dootask
- 问题反馈: https://github.com/kuaifan/dootask/issues
