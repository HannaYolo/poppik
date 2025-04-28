document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const promptInput = document.getElementById('prompt');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const animationVideo = document.getElementById('animation');
    const styleButtons = document.querySelectorAll('.style-btn');
    const characterCount = document.querySelector('.character-count');

    // 使用 DALL-E API
    const API_URL = 'https://api.openai.com/v1/images/generations';
    const API_KEY = 'key_69a31953c544effd12161aa1063e5fad0d819a825941ba0c5d3cf3a5ff03677bc7ca1bdf1b01b06cd1f3d1532bf6bdfda9b595449c3f50703adf6ae4c6c47c92';

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
            console.log('Sending request to API...');
            console.log('API URL:', API_URL);
            console.log('Prompt:', prompt);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    n: 1,
                    size: "512x512"
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            if (!data.data || !data.data[0]) {
                throw new Error('No image data received');
            }
            
            // 将生成的图片显示在页面上
            const img = document.createElement('img');
            img.src = data.data[0].url;
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