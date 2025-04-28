document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const promptInput = document.getElementById('prompt');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const animationVideo = document.getElementById('animation');

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('请输入动画描述！');
            return;
        }

        // 显示加载动画
        loadingDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');

        try {
            // 这里我们使用一个模拟的API响应
            // 在实际应用中，你需要替换为真实的AI动画生成API
            const response = await simulateAPIRequest(prompt);
            
            // 设置视频源
            animationVideo.src = response.videoUrl;
            animationVideo.load();
            
            // 显示结果
            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
        } catch (error) {
            alert('生成动画时出错，请重试！');
            loadingDiv.classList.add('hidden');
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (animationVideo.src) {
            const a = document.createElement('a');
            a.href = animationVideo.src;
            a.download = 'generated-animation.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
});

// 模拟API请求
function simulateAPIRequest(prompt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 这里返回一个示例视频URL
            // 在实际应用中，你需要替换为真实的API响应
            resolve({
                videoUrl: 'https://example.com/sample-animation.mp4'
            });
        }, 3000); // 模拟3秒的API响应时间
    });
} 