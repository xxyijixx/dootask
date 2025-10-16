import 'package:flutter/material.dart';

/// 视频会议界面
/// 
/// 这是Flutter原生实现的会议界面
/// 需要Agora SDK才能完整实现视频渲染
/// 当前提供基础UI框架
class MeetingScreen extends StatefulWidget {
  final String channelId;
  final int uid;

  const MeetingScreen({
    Key? key,
    required this.channelId,
    required this.uid,
  }) : super(key: key);

  @override
  State<MeetingScreen> createState() => _MeetingScreenState();
}

class _MeetingScreenState extends State<MeetingScreen> {
  bool _audioEnabled = true;
  bool _videoEnabled = true;
  bool _isFrontCamera = true;
  final List<int> _remoteUsers = [];

  @override
  void initState() {
    super.initState();
    _setupMeeting();
  }

  /// 设置会议
  Future<void> _setupMeeting() async {
    // TODO: 设置Agora事件监听
    // _engine.registerEventHandler(
    //   RtcEngineEventHandler(
    //     onUserJoined: (connection, remoteUid, elapsed) {
    //       setState(() {
    //         _remoteUsers.add(remoteUid);
    //       });
    //     },
    //     onUserOffline: (connection, remoteUid, reason) {
    //       setState(() {
    //         _remoteUsers.remove(remoteUid);
    //       });
    //     },
    //   ),
    // );
  }

  /// 切换音频
  Future<void> _toggleAudio() async {
    setState(() {
      _audioEnabled = !_audioEnabled;
    });

    // TODO: 调用MeetingService切换音频
    // await MeetingService().toggleAudio(_audioEnabled);
  }

  /// 切换视频
  Future<void> _toggleVideo() async {
    setState(() {
      _videoEnabled = !_videoEnabled;
    });

    // TODO: 调用MeetingService切换视频
    // await MeetingService().toggleVideo(_videoEnabled);
  }

  /// 切换摄像头
  Future<void> _switchCamera() async {
    setState(() {
      _isFrontCamera = !_isFrontCamera;
    });

    // TODO: 调用MeetingService切换摄像头
    // await MeetingService().switchCamera();
  }

  /// 离开会议
  Future<void> _leaveMeeting() async {
    // TODO: 调用MeetingService离开会议
    // await MeetingService().leaveMeeting();
    
    if (mounted) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(
          children: [
            // 视频渲染区域
            _buildVideoArea(),
            
            // 顶部信息栏
            _buildTopBar(),
            
            // 底部控制栏
            _buildControlBar(),
          ],
        ),
      ),
    );
  }

  /// 构建视频渲染区域
  Widget _buildVideoArea() {
    if (_remoteUsers.isEmpty) {
      // 没有其他参与者
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.videocam_off,
              size: 64,
              color: Colors.white.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              '等待其他人加入...',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 16,
              ),
            ),
          ],
        ),
      );
    }

    // 有参与者时显示视频网格
    return GridView.builder(
      padding: const EdgeInsets.all(8),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: _remoteUsers.length > 1 ? 2 : 1,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemCount: _remoteUsers.length,
      itemBuilder: (context, index) {
        final uid = _remoteUsers[index];
        return _buildRemoteVideoView(uid);
      },
    );
  }

  /// 构建远程视频视图
  Widget _buildRemoteVideoView(int uid) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[900],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Stack(
        children: [
          // TODO: Agora视频渲染
          // AgoraVideoView(
          //   controller: VideoViewController.remote(
          //     rtcEngine: _engine,
          //     canvas: VideoCanvas(uid: uid),
          //     connection: RtcConnection(channelId: widget.channelId),
          //   ),
          // ),
          
          // 用户信息
          Positioned(
            bottom: 8,
            left: 8,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.6),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                'User $uid',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 构建顶部信息栏
  Widget _buildTopBar() {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.black.withOpacity(0.7),
              Colors.transparent,
            ],
          ),
        ),
        child: Row(
          children: [
            // 频道信息
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    widget.channelId,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${_remoteUsers.length + 1} 人',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.7),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            
            // 切换摄像头按钮
            IconButton(
              icon: const Icon(Icons.flip_camera_ios),
              color: Colors.white,
              onPressed: _switchCamera,
            ),
          ],
        ),
      ),
    );
  }

  /// 构建底部控制栏
  Widget _buildControlBar() {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 32),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
            colors: [
              Colors.black.withOpacity(0.7),
              Colors.transparent,
            ],
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            // 音频按钮
            _buildControlButton(
              icon: _audioEnabled ? Icons.mic : Icons.mic_off,
              label: _audioEnabled ? '静音' : '取消静音',
              onPressed: _toggleAudio,
            ),
            
            // 视频按钮
            _buildControlButton(
              icon: _videoEnabled ? Icons.videocam : Icons.videocam_off,
              label: _videoEnabled ? '关闭视频' : '打开视频',
              onPressed: _toggleVideo,
            ),
            
            // 挂断按钮
            _buildControlButton(
              icon: Icons.call_end,
              label: '离开',
              color: Colors.red,
              onPressed: _leaveMeeting,
            ),
          ],
        ),
      ),
    );
  }

  /// 构建控制按钮
  Widget _buildControlButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
    Color? color,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        FloatingActionButton(
          backgroundColor: color ?? Colors.white.withOpacity(0.2),
          onPressed: onPressed,
          child: Icon(
            icon,
            color: color != null ? Colors.white : Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    // 清理资源
    super.dispose();
  }
}

