/// JavaScript桥接消息模型
class BridgeMessage {
  final String method;
  final dynamic requestId;
  final Map<String, dynamic>? params;

  BridgeMessage({
    required this.method,
    this.requestId,
    this.params,
  });

  /// 从JSON创建消息对象
  factory BridgeMessage.fromJson(Map<String, dynamic> json) {
    return BridgeMessage(
      method: json['method'] as String,
      requestId: json['requestId'],
      params: json['params'] as Map<String, dynamic>?,
    );
  }

  /// 转换为JSON
  Map<String, dynamic> toJson() {
    return {
      'method': method,
      'requestId': requestId,
      'params': params,
    };
  }

  @override
  String toString() {
    return 'BridgeMessage{method: $method, requestId: $requestId, params: $params}';
  }
}

/// 桥接响应消息
class BridgeResponse {
  final bool success;
  final dynamic data;
  final String? error;

  BridgeResponse({
    required this.success,
    this.data,
    this.error,
  });

  /// 成功响应
  factory BridgeResponse.success({dynamic data}) {
    return BridgeResponse(
      success: true,
      data: data,
    );
  }

  /// 错误响应
  factory BridgeResponse.error(String error) {
    return BridgeResponse(
      success: false,
      error: error,
    );
  }

  /// 转换为JSON
  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'data': data,
      'error': error,
    };
  }
}

