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

    let items = [
        { 
            title: "Alien Egg Lamp", 
            image: "https://picsum.photos/seed/alien/500/500"
        },
        { 
            title: "NFT Toilet Paper", 
            image: "https://picsum.photos/seed/nft/500/500"
        },
        { 
            title: "Floating Dog Statue", 
            image: "https://picsum.photos/seed/dog/500/500"
        },
        { 
            title: "Crypto Banana", 
            image: "https://picsum.photos/seed/banana/500/500"
        },
        { 
            title: "Invisible Chair", 
            image: "https://picsum.photos/seed/chair/500/500"
        }
    ];

    let currentItem = 0;
    let yes = 0;
    let no = 0;
    let points = 0;

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
            alert('请输入动画描述');
            return;
        }

        // 显示加载动画
        loadingSection.style.display = 'block';
        progressBar.style.width = '0%';
        generateBtn.disabled = true;

        try {
            // 获取用户选择的参数
            const duration = durationSlider.value;
            const fps = fpsSelect.value;
            const style = selectedStyle;

            // 构建请求数据
            const requestData = {
                prompt: prompt,
                duration: duration,
                fps: fps,
                style: style
            };

            // 发送请求到后端
            const response = await fetch('/api/generate-animation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('生成失败');
            }

            const data = await response.json();
            
            previewBox.innerHTML = `
                <img id="generatedImage" src="${data.imageUrl}" alt="生成的图片">
            `;

            playBtn.disabled = true;  // 暂时禁用播放按钮
            pauseBtn.disabled = true;  // 暂时禁用暂停按钮
            downloadBtn.disabled = false;  // 启用下载按钮

            // 更新下载功能
            downloadBtn.addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = data.imageUrl;
                link.download = 'generated-image.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });

        } catch (error) {
            console.error('生成动画时出错:', error);
            alert('生成动画失败，请稍后重试');
        } finally {
            loadingSection.style.display = 'none';
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

    // 图片上传处理
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // 预览上传的图片
                document.getElementById('itemImage').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 添加新物品
    function addNewItem() {
        const itemName = document.getElementById('itemName').value.trim();
        const imageUrl = document.getElementById('itemImage').src;
        
        if (!itemName) {
            alert('Please enter an item name!');
            return;
        }
        
        items.push({
            title: itemName,
            image: imageUrl
        });
        
        // 清空输入
        document.getElementById('itemName').value = '';
        document.getElementById('imageUpload').value = '';
        
        // 显示新添加的物品
        currentItem = items.length - 1;
        updateDisplay();
        
        alert('Item added successfully!');
    }

    function updateDisplay() {
        document.getElementById("itemImage").src = items[currentItem].image;
        document.getElementById("itemTitle").innerText = items[currentItem].title;
        yes = 0;
        no = 0;
        document.getElementById("yesVotes").innerText = `Worth It: ${yes}`;
        document.getElementById("noVotes").innerText = `Not Worth It: ${no}`;
    }

    function vote(type) {
        if (type === "yes") {
            yes++;
            points += 2;
        } else {
            no++;
            points += 1;
        }
        document.getElementById("yesVotes").innerText = `Worth It: ${yes}`;
        document.getElementById("noVotes").innerText = `Not Worth It: ${no}`;
        document.getElementById("points").innerText = points;
    }

    function nextItem() {
        currentItem = (currentItem + 1) % items.length;
        updateDisplay();
    }

    window.onload = updateDisplay;
}); 
