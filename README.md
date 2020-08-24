# traceSDK

前端项目统一使用与后端约定的 trace-id 方便疑难错误排查

## Usage

### Client-side

针对业务 VueUI,后台系统使用 ElementUI,H5 使用 vant。会引用[element-ui](https://element.eleme.cn)和[vant](https://youzan.github.io/vant/)

**1、示例脚本代码**

```javascript
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
...
const request = axios.create();
var traceSDK = new TraceSDK();
traceSDK.axiosInit(request, {
  'Content-Type': 'application/json'
});
// 添加一个请求拦截器
request.interceptors.request.use(
  function (config) {
    Object.assign(config.headers, traceSDK.getTraceIdHeader());
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 添加一个响应拦截器
request.interceptors.response.use(
  function (response) {
    var traceId = res.config.headers['X-TRACE-ID'];
    Element.Message.error(traceId || '服务异常');
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

function test() {
  var url = 'https://api.apiopen.top/getSingleJoke?sid=28654780';
  // console.log(request, 'request');
  request.get(url);
}
```

### Todo

- [x] axios
- [ ] XMLHttpRequest
- [ ] fetch 封装
