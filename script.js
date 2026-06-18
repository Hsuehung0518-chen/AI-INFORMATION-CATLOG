// 1. 預設資料庫 (備用金鑰)
const defaultDatabase = [
    { id: "01", title: "復古漫畫動作藍圓", desc: "充滿活力且具權威感，適合產品發布與團隊激勵。", prompt: "Generate a highly detailed infographic in a Retro-Comic Action Blueprint style. The overall tone should be energetic and authoritative. Use a color scheme of Background: #FFDDD00, Text: #000000, Accent: #FF3333. Incorporate thick black outlines, Ben-Day dot shading, and motion lines." },
    { id: "02", title: "工程藍圖示意圖", desc: "精確且具工程感，適合深度研究報告與架構圖。", prompt: "Create a highly detailed Engineering Blueprint Schematic infographic about [Subject]. The tone is precise and engineered. Color scheme: Background #0b1623, Text #f0f0f0, Accent #ff9f39. Feature an exploded view wireframe." },
    { id: "03", title: "熱成像數據科技風", desc: "具分析性且充滿未來感，適合網路安全與風險控管。", prompt: "Generate a Thermal Insight Tech infographic analyzing [Subject]. The tone is analytical and futuristic. Color scheme: Background #050826, Text #FFFFFF, Accent #FFC800. Overlay technical HUD elements." },
    { id: "11", title: "玻璃擬態 (Glassmorphism)", desc: "俐落流暢、輕盈通透、高級質感。", prompt: "Design a highly detailed Glassmorphism infographic about [Subject]. Tone is sleek and premium. Use a vibrant flowing dark gradient background. Present information inside translucent frosted white glass panels." },
    { id: "12", title: "便當盒風格 (Bento Box)", desc: "整潔有序、現代、高效直觀，適配自適應模組化網格。", prompt: "Create an organized Bento Box Style infographic explaining [Subject]. Tone is modern and efficient. Colors: Background #F2F4F7, Containers #FFFFFF. Use a tight modular grid of rounded corner containers." },
    { id: "13", title: "瑞士風格 (Swiss Style)", desc: "客觀、極簡、功能主義，拒絕裝飾的強烈對比。", prompt: "Design an International Typographic / Swiss Style infographic conveying [Subject]. Tone is objective and functional minimalist. Strictly align all elements to a rigid mathematical grid. Typography must be flush left." }
];

// 動態資料池
let currentDatabase = [];

// 2. DOM 節點綁定
const bentoGrid = document.getElementById('bentoGrid');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const importLabel = document.getElementById('importLabel');
// (設定面板相關 DOM)
const settingsModal = document.getElementById('settingsModal');
const themeSelect = document.getElementById('themeSelect');
const seniorToggle = document.getElementById('seniorToggle');

// 3. 資料初始化與渲染
function initData() {
    const savedData = localStorage.getItem('ide_custom_data');
    if (savedData) {
        try {
            currentDatabase = JSON.parse(savedData);
        } catch (e) {
            console.error("資料解析失敗，載入預設值");
            currentDatabase = [...defaultDatabase];
        }
    } else {
        currentDatabase = [...defaultDatabase];
    }
    renderGrid(currentDatabase);
}

function renderGrid(dataArray) {
    if (dataArray.length === 0) {
        bentoGrid.innerHTML = `<div class="empty-state">🧐 找不到符合的風格，請嘗試其他關鍵字。</div>`;
        return;
    }

    bentoGrid.innerHTML = dataArray.map(style => `
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

// 4. [新增] 智慧搜尋邏輯
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filteredData = currentDatabase.filter(style => 
        style.title.toLowerCase().includes(term) ||
        style.desc.toLowerCase().includes(term) ||
        style.id.toLowerCase().includes(term)
    );
    renderGrid(filteredData);
});

// 5. [新增] 匯出 JSON 備份
exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(currentDatabase, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Style_Backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    // 按鈕 UI 回饋
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = "✅ 已匯出";
    setTimeout(() => exportBtn.innerHTML = originalText, 2000);
});

// 6. [新增] 匯入 JSON 還原
importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            if (Array.isArray(importedData)) {
                currentDatabase = importedData;
                localStorage.setItem('ide_custom_data', JSON.stringify(currentDatabase));
                searchInput.value = ''; // 清除搜尋狀態
                renderGrid(currentDatabase);
                
                // 按鈕 UI 回饋
                const originalText = importLabel.innerHTML;
                importLabel.innerHTML = "✅ 匯入成功";
                importLabel.style.borderColor = "#10b981";
                setTimeout(() => {
                    importLabel.innerHTML = originalText;
                    importLabel.style.borderColor = "";
                }, 2000);
            }
        } catch (err) {
            alert("❌ 無法解析 JSON 檔案，請確保格式正確。");
        }
        e.target.value = ''; // 重設 input 以便重複匯入同檔名
    };
    reader.readAsText(file);
});

// 7. 一鍵複製 (對接動態資料庫)
window.copyPrompt = function(id) {
    const style = currentDatabase.find(s => s.id === id);
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

// 8. 偏好設定與狀態管理
function applySettings(isPreview = false) {
    const theme = themeSelect.value;
    const isSenior = seniorToggle.checked;
    document.documentElement.setAttribute('data-theme', theme);
    if (isSenior) { document.body.classList.add('senior-mode'); } 
    else { document.body.classList.remove('senior-mode'); }

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

// 系統初始化與事件綁定
document.getElementById('settingsBtn').addEventListener('click', () => settingsModal.showModal());
document.getElementById('applyBtn').addEventListener('click', () => applySettings(true));
document.getElementById('saveBtn').addEventListener('click', () => applySettings(false));
document.getElementById('resetBtn').addEventListener('click', () => {
    themeSelect.value = 'dark';
    seniorToggle.checked = false;
    applySettings(true);
});

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initData();
});
