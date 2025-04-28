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
            // 使用代理服务器来避免 CORS 问题
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://picsum.photos/500/500';
            
            const response = await fetch(proxyUrl + targetUrl, {
                headers: {
                    'Origin': window.location.origin
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const imageUrl = response.url;
            displayResult(imageUrl);
        } catch (error) {
            console.error('Error details:', error);
            showError(`Error creating image: ${error.message}`);
        } finally {
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
