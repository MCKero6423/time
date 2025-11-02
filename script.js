const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

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

// 初始更新
updateTime();

// 每秒更新
setInterval(updateTime, 1000);