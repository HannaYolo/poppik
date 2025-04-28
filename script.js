document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const promptInput = document.getElementById('prompt');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const animationVideo = document.getElementById('animation');
    const styleButtons = document.querySelectorAll('.style-btn');
    const characterCount = document.querySelector('.character-count');

    // 设置你的 API key
    const RUNWAY_API_KEY = 'key_15a0449216e9caae371dce153ed4f4ab3781e2cc7b484540117f4959a3c7211da825139709e48c24cd1f663c36d6e4280222cee96ab1a3486d238a1d886aa05b';

    let selectedStyle = 'meme'; // 默认选择表情包风格

    // 处理风格选择
    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            styleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedStyle = button.dataset.style;
        });
    });

    // 字符计数
    promptInput.addEventListener('input', () => {
        const count = promptInput.value.length;
        characterCount.textContent = `${count}/100`;
        if (count > 100) {
            characterCount.style.color = '#ff69b4';
        } else {
            characterCount.style.color = '#666';
        }
    });

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter an animation description! 🎨');
            return;
        }

        if (prompt.length > 100) {
            alert('Description is too long! Please keep it under 100 characters. ✨');
            return;
        }

        // 显示加载动画
        loadingDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');

        try {
            // 根据选择的风格设置参数
            const params = {
                meme: { num_frames: 10, fps: 10 },
                short: { num_frames: 30, fps: 15 },
                long: { num_frames: 60, fps: 24 }
            }[selectedStyle];

            // 使用 Runway ML API
            const response = await fetch('https://api.runwayml.com/v1/text-to-video/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RUNWAY_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    num_frames: params.num_frames,
                    fps: params.fps,
                    width: 512,
                    height: 512,
                    seed: Math.floor(Math.random() * 1000000),
                    guidance_scale: 7.5,
                    num_inference_steps: 50
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API request failed');
            }

            const data = await response.json();
            
            if (!data.video_url) {
                throw new Error('No video URL received');
            }
            
            // 设置视频源
            animationVideo.src = data.video_url;
            animationVideo.load();
            
            // 显示结果
            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating animation: ' + error.message);
            loadingDiv.classList.add('hidden');
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (animationVideo.src) {
            const a = document.createElement('a');
            a.href = animationVideo.src;
            a.download = `hannahstoy-${selectedStyle}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
}); 