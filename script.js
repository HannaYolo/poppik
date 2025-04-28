document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const avatar = document.getElementById('avatar');
    const moodText = document.querySelector('.mood-text');
    const styleButtons = document.querySelectorAll('.style-btn');
    const voiceSelect = document.getElementById('voice-select');
    const speedSlider = document.getElementById('speed-slider');

    let selectedStyle = 'casual';
    let currentMood = 'listening';

    // 初始化语音合成
    const synth = window.speechSynthesis;
    let voices = [];

    // 加载可用语音
    function loadVoices() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = voices
            .filter(voice => voice.lang.includes('en'))
            .map(voice => `<option value="${voice.name}">${voice.name}</option>`)
            .join('');
    }

    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }

    // 更新心情指示器
    function updateMood(mood) {
        currentMood = mood;
        moodText.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
        avatar.style.borderColor = getMoodColor(mood);
    }

    function getMoodColor(mood) {
        const colors = {
            listening: '#00ff9d',
            thinking: '#00b8ff',
            speaking: '#ff9d00',
            error: '#ff4444'
        };
        return colors[mood] || colors.listening;
    }

    // 添加消息到聊天界面
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 处理AI响应
    async function handleAIResponse(userMessage) {
        updateMood('thinking');
        
        try {
            // 这里可以替换为实际的AI API调用
            const response = await simulateAIResponse(userMessage);
            
            updateMood('speaking');
            addMessage(response);
            
            // 语音合成
            const utterance = new SpeechSynthesisUtterance(response);
            const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.rate = speedSlider.value / 3;
            synth.speak(utterance);
            
            utterance.onend = () => {
                updateMood('listening');
            };
        } catch (error) {
            updateMood('error');
            addMessage('Sorry, I encountered an error. Please try again.');
            console.error('Error:', error);
        }
    }

    // 模拟AI响应（可以替换为实际的API调用）
    function simulateAIResponse(message) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = {
                    casual: [
                        "That's interesting! Tell me more about it.",
                        "I see what you mean. How does that make you feel?",
                        "I'm here to chat! What else would you like to talk about?"
                    ],
                    professional: [
                        "I understand your point. Let me provide some insights.",
                        "Based on the information provided, I would suggest...",
                        "Let me analyze that for you."
                    ],
                    creative: [
                        "That's a fascinating idea! Let's explore it further.",
                        "I love your creativity! What inspired you to think about this?",
                        "Let's brainstorm some unique solutions together!"
                    ]
                };
                
                const styleResponses = responses[selectedStyle];
                const randomResponse = styleResponses[Math.floor(Math.random() * styleResponses.length)];
                resolve(randomResponse);
            }, 1000);
        });
    }

    // 事件监听器
    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            styleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedStyle = button.dataset.style;
        });
    });

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            handleAIResponse(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // 初始化欢迎消息
    addMessage("Hello! I'm your AI assistant. How can I help you today?");
}); 
