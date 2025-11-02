const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// 存储时间同步信息
let timeDifference = null;
let syncAccuracy = null;

const worldCities = [
    { name: '北京', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
    { name: '东京', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    { name: '新加坡', timezone: 'Asia/Singapore', flag: '🇸🇬' },
    { name: '伦敦', timezone: 'Europe/London', flag: '🇬🇧' },
    { name: '巴黎', timezone: 'Europe/Paris', flag: '🇫🇷' },
    { name: '纽约', timezone: 'America/New_York', flag: '🇺🇸' },
    { name: '洛杉矶', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
    { name: '悉尼', timezone: 'Australia/Sydney', flag: '🇦🇺' }
];

function updateTime() {
    const now = new Date();
    
    // 本地时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
    
    // 日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    document.getElementById('currentDate').textContent = `${year}年${month}月${day}日`;
    
    // 星期
    document.getElementById('currentWeek').textContent = weekDays[now.getDay()];
    
    // 时区
    const offset = -now.getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '';
    document.getElementById('timezone').textContent = `GMT${sign}${offset}`;
    
    // Unix 时间戳
    document.getElementById('timestamp').textContent = Math.floor(now.getTime() / 1000);
    
    // ISO 8601
    document.getElementById('iso8601').textContent = now.toISOString();
    
    // UTC 时间
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    document.getElementById('utcTime').textContent = `${utcHours}:${utcMinutes}:${utcSeconds}`;
    
    // 世界时间
    updateWorldTimes();
}

function updateWorldTimes() {
    const container = document.getElementById('worldTimes');
    const now = new Date();
    
    container.innerHTML = worldCities.map(city => {
        const cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
        const hours = String(cityTime.getHours()).padStart(2, '0');
        const minutes = String(cityTime.getMinutes()).padStart(2, '0');
        const seconds = String(cityTime.getSeconds()).padStart(2, '0');
        const date = `${cityTime.getMonth() + 1}/${cityTime.getDate()}`;
        
        return `
            <div class="world-item">
                <div class="city">${city.flag} ${city.name}</div>
                <div class="time">${hours}:${minutes}:${seconds}</div>
                <div class="date">${date}</div>
            </div>
        `;
    }).join('');
}

// 检查系统时间精确度
async function checkTimeAccuracy() {
    try {
        const t0 = performance.now();
        const localTimeBefore = Date.now();
        
        // 使用 worldtimeapi.org 作为时间源
        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        
        const t1 = performance.now();
        const localTimeAfter = Date.now();
        
        const data = await response.json();
        const serverTime = data.unixtime * 1000 + Math.floor(data.raw_offset * 1000);
        
        // 计算往返延迟
        const roundTripTime = t1 - t0;
        syncAccuracy = roundTripTime / 2;
        
        // 估算服务器时间（考虑网络延迟）
        const estimatedServerTime = serverTime + (roundTripTime / 2);
        const localTimeMiddle = (localTimeBefore + localTimeAfter) / 2;
        
        // 计算时间差（正数表示本地时间快，负数表示慢）
        timeDifference = (localTimeMiddle - estimatedServerTime) / 1000;
        
        updateSyncInfo();
    } catch (error) {
        console.error('时间同步检测失败:', error);
        document.getElementById('syncInfo').innerHTML = '<div class="sync-status">无法连接到时间服务器</div>';
    }
}

// 更新同步信息显示
function updateSyncInfo() {
    const syncInfoEl = document.getElementById('syncInfo');
    
    if (timeDifference === null) {
        syncInfoEl.innerHTML = '<div class="sync-status">检测中...</div>';
        return;
    }
    
    const absDiff = Math.abs(timeDifference);
    let statusClass = 'sync-perfect';
    let statusText = '';
    
    if (absDiff < 0.1) {
        statusClass = 'sync-perfect';
        statusText = '您的系统时间非常精确！';
    } else if (timeDifference > 0) {
        statusClass = 'sync-fast';
        statusText = `您的系统时间快了 ${absDiff.toFixed(1)} 秒钟。`;
    } else {
        statusClass = 'sync-slow';
        statusText = `您的系统时间慢了 ${absDiff.toFixed(1)} 秒钟。`;
    }
    
    const accuracyText = `<br>同步精确度为 ±${syncAccuracy.toFixed(0)} 毫秒。`;
    
    syncInfoEl.innerHTML = `<div class="sync-status ${statusClass}">${statusText}${accuracyText}</div>`;
}

// 初始更新
updateTime();
checkTimeAccuracy();

// 每秒更新
setInterval(updateTime, 1000);