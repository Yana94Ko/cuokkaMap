const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    //'/api' 요청의 경우 프록시 통해 백엔드 서버로 요청
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://cuokkamap.com/:8021',
            changeOrigin: true,
        })
    );
};
