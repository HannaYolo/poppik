const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 模拟图片生成
app.post('/generate', (req, res) => {
    console.log('Received request:', req.body);
    
    // 模拟延迟
    setTimeout(() => {
        res.json({
            output_url: 'https://picsum.photos/500/500'
        });
    }, 2000);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 