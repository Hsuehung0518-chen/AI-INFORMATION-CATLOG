// 1. 資料源匯入 (來自百科 PDF 分析)
const styleDatabase = [
    {
        id: "01",
        title: "復古漫畫動作藍圓",
        desc: "充滿活力且具權威感，適合產品發布與團隊激勵。",
        prompt: "Generate a highly detailed infographic in a Retro-Comic Action Blueprint style. The overall tone should be energetic and authoritative. Use a color scheme of Background: #FFDDD00, Text: #000000, Accent: #FF3333. Incorporate thick black outlines, Ben-Day dot shading, and motion lines."
    },
    {
        id: "02",
        title: "工程藍圖示意圖",
        desc: "精確且具工程感，適合深度研究報告與架構圖。",
        prompt: "Create a highly detailed Engineering Blueprint Schematic infographic about [Subject]. The tone is precise and engineered. Color scheme: Background #0b1623, Text #f0f0f0, Accent #ff9f39. Feature an exploded view wireframe."
    },
    {
        id: "03",
        title: "熱成像數據科技風",
        desc: "具分析性且充滿未來感，適合網路安全與風險控管。",
        prompt: "Generate a Thermal Insight Tech infographic analyzing [Subject]. The tone is analytical and futuristic. Color scheme: Background #050826, Text #FFFFFF, Accent #FFC800. Overlay technical HUD elements."
    },
    {
        id: "11",
        title: "玻璃擬態 (Glassmorphism)",
        desc: "俐落流暢、輕盈通透、高級質感。",
        prompt: "Design a highly detailed Glassmorphism infographic about [Subject]. Tone is sleek and premium. Use a vibrant flowing dark gradient background. Present information inside translucent frosted white glass panels."
    },
    {
        id: "12",
        title: "便當盒風格 (Bento Box)",
        desc: "整潔有序、現代、高效直觀，適配自適應模組化網格。",
        prompt: "Create an organized Bento Box Style infographic explaining [Subject]. Tone is modern and efficient. Colors: Background #F2F4F7, Containers #FFFFFF. Use a tight modular grid of rounded corner containers."
    },
    {
        id: "13",
        title: "瑞士風格 (Swiss Style)",
        desc: "客觀、極簡、功能主義，拒絕裝飾的強烈對比。",
        prompt: "Design an International Typographic / Swiss Style infographic conveying [Subject]. Tone is objective and functional minimalist. Strictly align all elements to a rigid mathematical grid. Typography must be flush left."
    }
    // 註：其餘 7 種風格 (紐莫變形、孔版印刷、日式漫畫、賽博龐克、美式餐廳、水墨卷軸、教育手繪) 可依相同 JSON 結構擴充。
];

// 2. DOM 節點綁定
const bentoGrid = document.getElementById('bentoGrid');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const themeSelect = document.getElementById('themeSelect');
const seniorToggle = document.getElementById('seniorToggle');
const applyBtn = document.getElementById('applyBtn');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');

// 3. 渲染主畫面
function renderGrid() {
    bentoGrid.innerHTML = styleDatabase.map(style => `
        <article class="bento-card">
            <div class="card-header">
                <span class="style-id">${style.id}</span>
                <h3 class="card-title">${style.title}</h3>
            </div>
            <p class="card-desc">${style.desc}</p>
            <button class="btn-primary" onclick="copyPrompt('${style.id}')" id="btn-${style.id}">
                📋 複製 Prompt
            </button>
        </article>
    `).join('');
}

// 4. 一鍵複製功能
window.copyPrompt = function(id) {
    const style = styleDatabase.find(s => s.id === id);
    if (!style) return;

    navigator.clipboard.writeText(style.prompt).then(() => {
        const btn = document.getElementById(`btn-${id}`);
        const originalText = btn.innerHTML;
        btn.innerHTML = "✅ 已複製至剪貼簿";
        btn.style.backgroundColor = "#10b981";
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = "";
        }, 2000);
    });
}

// 5. 偏好設定與狀態管理 (鐵律6 & 8)
function applySettings(isPreview = false) {
    const theme = themeSelect.value;
    const isSenior = seniorToggle.checked;

    document.documentElement.setAttribute('data-theme', theme);
    if (isSenior) {
        document.body.classList.add('senior-mode');
    } else {
        document.body.classList.remove('senior-mode');
    }

    if (!isPreview) {
        localStorage.setItem('ide_theme', theme);
        localStorage.setItem('ide_senior', isSenior);
        settingsModal.close();
    }
}

function loadSettings() {
    const savedTheme = localStorage.getItem('ide_theme') || 'dark';
    const savedSenior = localStorage.getItem('ide_senior') === 'true';

    themeSelect.value = savedTheme;
    seniorToggle.checked = savedSenior;
    applySettings(true);
}

// 事件監聽
settingsBtn.addEventListener('click', () => settingsModal.showModal());
applyBtn.addEventListener('click', () => applySettings(true));
saveBtn.addEventListener('click', () => applySettings(false));
resetBtn.addEventListener('click', () => {
    themeSelect.value = 'dark';
    seniorToggle.checked = false;
    applySettings(true);
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    renderGrid();
});
