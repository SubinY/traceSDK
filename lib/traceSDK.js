/**
 * TraceSDK sdk 兼容模块加载器如RequireJS和所有浏览器
 */
/*global define*/
!(function (name, definition) {
  // Check define
  var hasDefine = typeof define === 'function' && Boolean(define.amd);

  if (hasDefine) {
    // CMD Module or AMD Module
    if (ELEMENT) {
      define(['element-ui', null], definition);
    } else if (vant) {
      define([null, 'vant'], definition);
    }
  } else {
    // Assign to common namespaces or simply the global object (window)
    if (ELEMENT) {
      this[name] = definition(ELEMENT);
    } else if (vant) {
      this[name] = definition(null, vant);
    }
    // Backwards compatibility
    typeof module === 'function' && (module.exports = this[name]);
  }
})('TraceSDK', function (ELEMENT, vant) {
  ELEMENT = ELEMENT || function () {};
  vant = vant || function () {};

  /**
   * uuidv4
   */
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * @constructor
   */
  function TraceSDK() {
    if (!(this instanceof TraceSDK)) {
      return new TraceSDK();
    }
  }

  /**
   * uuidv4
   */
  TraceSDK.prototype.uuid = uuidv4;

  /**
   * 与后端约定 {X-TRACE-ID: 'xxxx'}
   */
  TraceSDK.prototype.getTraceIdHeader = function (name) {
    var _name = name || 'X-TRACE-ID';
    return { [_name]: uuidv4() };
  };

  /**
   * axios实例化
   * @param httpIns 初始化实例
   * @param {*} opts 仅接受header头
   */
  TraceSDK.prototype.axiosInit = function (httpIns, opts) {
    if (!httpIns) {
      throw new Error('httpIns is required parameters');
    }
    httpIns.interceptors.request.use(function (config) {
      // 配合后端日志排查，需生成uuid做唯一表示
      Object.assign(config.headers, opts, { 'X-TRACE-ID': uuidv4() });
      console.log(config.headers);
      return config;
    });
    httpIns.interceptors.response.use(function (res) {
      var data = res.data.data,
        code = res.data.code,
        msg = res.data.msg,
        url = res.config.url,
        traceId = res.config.headers['X-TRACE-ID'];
      var errMsg = `${msg}, X-TRACE-ID: ${traceId}`;
      if (code !== 200) {
        if (ELEMENT) {
          ELEMENT.Message.error(errMsg || '服务异常');
        } else if (vant) {
          vant.Toast(errMsg || '服务异常');
        }

        console.error(`api:${url},错误信息:${errMsg || '未知服务异常'}`);
      }
      return data;
    });
  };
  // Backwards compatibility
  TraceSDK.TraceSDK = TraceSDK;

  return TraceSDK;
});
