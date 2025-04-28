document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const promptInput = document.getElementById('prompt');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const animationVideo = document.getElementById('animation');
    const styleButtons = document.querySelectorAll('.style-btn');
    const characterCount = document.querySelector('.character-count');

    // 使用 Stable Diffusion API
    const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
    const API_KEY = 'sk-824b82caaf55800eedc6a34a0cdb0e020953216abd7f990a1d29771e569bbfbe354a14d73126ff9a6619d5a7e48ef9331e039d5c4cd354aa2db5f47e4fb1e857';

    let selectedStyle = 'meme';

    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            styleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedStyle = button.dataset.style;
        });
    });

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

        loadingDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    text_prompts: [
                        {
                            text: prompt,
                            weight: 1
                        }
                    ],
                    cfg_scale: 7,
                    height: 512,
                    width: 512,
                    steps: 30,
                    samples: 1
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`API request failed: ${errorData.message || response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.artifacts || !data.artifacts[0]) {
                throw new Error('No image data received');
            }
            
            // 将生成的图片显示在页面上
            const img = document.createElement('img');
            img.src = `data:image/png;base64,${data.artifacts[0].base64}`;
            img.style.width = '100%';
            img.style.maxWidth = '500px';
            img.style.borderRadius = '15px';
            
            // 清空并添加图片到结果区域
            resultDiv.innerHTML = '';
            resultDiv.appendChild(img);
            
            // 显示结果
            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating image: ' + error.message);
            loadingDiv.classList.add('hidden');
        }
    });

    downloadBtn.addEventListener('click', () => {
        const img = resultDiv.querySelector('img');
        if (img) {
            const a = document.createElement('a');
            a.href = img.src;
            a.download = `hannahstoy-${selectedStyle}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
}); 