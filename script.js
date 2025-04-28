document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const promptInput = document.getElementById('prompt');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const animationVideo = document.getElementById('animation');
    const styleButtons = document.querySelectorAll('.style-btn');
    const characterCount = document.querySelector('.character-count');

    const API_URL = 'https://api.runwayml.com/v1/generate';
    const API_KEY = 'key_1c58089272e71eb5538f681eea7d2b0db6ad3e58eec978aaa5c2958739d07dc9ed550ac204440ad743da08e242368f4986d031e1d4a6515a03f46d41d26be2e5';

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

        showLoading();
        hideResult();

        try {
            console.log('Sending request to API...');
            console.log('API URL:', API_URL);
            console.log('Prompt:', prompt);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: "stable-diffusion-v1-5",
                    num_inference_steps: 50,
                    guidance_scale: 7.5
                }),
                mode: 'cors'
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.error) {
                throw new Error(data.error.message);
            }

            if (!data.output || !data.output[0]) {
                throw new Error('Invalid response format from API');
            }

            const imageUrl = data.output[0];
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
