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