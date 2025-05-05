const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// 启用 CORS
app.use(cors());

// 提供静态文件
app.use(express.static(__dirname));

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(port, '0.0.0.0', () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log('其他设备可以通过您的IP地址访问，例如：http://192.168.1.xxx:3000');
}); 