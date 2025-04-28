document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const previewBox = document.getElementById('preview-box');
    const promptInput = document.getElementById('prompt-input');
    const characterCount = document.querySelector('.character-count');
    const styleButtons = document.querySelectorAll('.style-btn');
    const durationSlider = document.getElementById('duration-slider');
    const durationValue = document.getElementById('duration-value');
    const fpsSelect = document.getElementById('fps-select');
    const generateBtn = document.getElementById('generate-btn');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const downloadBtn = document.getElementById('download-btn');
    const loadingSection = document.getElementById('loading');
    const progressBar = document.getElementById('progress');

    let selectedStyle = 'anime';
    let currentAnimation = null;
    let isPlaying = false;

    // 更新字符计数
    promptInput.addEventListener('input', () => {
        const count = promptInput.value.length;
        characterCount.textContent = `${count}/500`;
        if (count > 500) {
            characterCount.style.color = '#ff4444';
        } else {
            characterCount.style.color = '#666';
        }
    });

    // 更新持续时间显示
    durationSlider.addEventListener('input', () => {
        durationValue.textContent = `${durationSlider.value}s`;
    });

    // 样式选择
    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            styleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedStyle = button.dataset.style;
        });
    });

    // 生成动画
    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a description for your animation');
            return;
        }

        if (prompt.length > 500) {
            alert('Description is too long. Maximum 500 characters.');
            return;
        }

        // 显示加载状态
        loadingSection.classList.remove('hidden');
        generateBtn.disabled = true;
        progressBar.style.width = '0%';

        try {
            // 这里可以替换为实际的API调用
            await simulateAnimationGeneration(prompt);
            
            // 启用控制按钮
            playBtn.disabled = false;
            pauseBtn.disabled = false;
            downloadBtn.disabled = false;
        } catch (error) {
            console.error('Error generating animation:', error);
            alert('Failed to generate animation. Please try again.');
        } finally {
            loadingSection.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });

    // 播放控制
    playBtn.addEventListener('click', () => {
        if (currentAnimation && !isPlaying) {
            isPlaying = true;
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            // 这里添加实际的播放逻辑
        }
    });

    pauseBtn.addEventListener('click', () => {
        if (currentAnimation && isPlaying) {
            isPlaying = false;
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            // 这里添加实际的暂停逻辑
        }
    });

    // 下载动画
    downloadBtn.addEventListener('click', () => {
        if (currentAnimation) {
            // 这里添加实际的下载逻辑
            const link = document.createElement('a');
            link.href = currentAnimation;
            link.download = 'animation.mp4';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    // 模拟动画生成过程
    async function simulateAnimationGeneration(prompt) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    // 模拟生成的动画URL
                    currentAnimation = 'https://example.com/animation.mp4';
                    resolve();
                }
            }, 200);
        });
    }
}); 
