document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const promptInput = document.getElementById('prompt');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const styleButtons = document.querySelectorAll('.style-btn');
    const characterCount = document.querySelector('.character-count');

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
            alert('Please enter a description first!');
            return;
        }

        showLoading();
        hideResult();

        try {
            console.log('Starting image generation...');
            console.log('Current URL:', window.location.href);
            
            // 使用不同的图片 API 端点
            const apiUrl = 'https://picsum.photos/500/500';
            console.log('API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                mode: 'no-cors', // 尝试使用 no-cors 模式
                cache: 'no-cache',
                headers: {
                    'Accept': 'image/*'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response type:', response.type);
            console.log('Response headers:', response.headers);

            if (!response.ok && response.type !== 'opaque') {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 直接使用图片 URL
            const imageUrl = apiUrl;
            console.log('Image URL:', imageUrl);
            
            // 预加载图片
            const img = new Image();
            img.onload = () => {
                console.log('Image loaded successfully');
                displayResult(imageUrl);
                hideLoading();
            };
            img.onerror = (error) => {
                console.error('Image load error:', error);
                showError('Failed to load image. Please try again.');
                hideLoading();
            };
            img.src = imageUrl;

        } catch (error) {
            console.error('Error details:', error);
            console.error('Error stack:', error.stack);
            showError(`Error creating image: ${error.message}`);
            hideLoading();
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

function showLoading() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.add('hidden');
}

function showResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('hidden');
}

function hideResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.classList.add('hidden');
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <p>Please try again later or check your internet connection.</p>
        </div>
    `;
    resultDiv.classList.remove('hidden');
}

function displayResult(imageUrl) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <img src="${imageUrl}" alt="Generated image" style="width: 100%; max-width: 500px; border-radius: 15px;">
        <button class="glow-button" onclick="window.open('${imageUrl}', '_blank')">Open in New Tab</button>
    `;
    resultDiv.classList.remove('hidden');
} 
