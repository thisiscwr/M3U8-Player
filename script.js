var videoSourceInput = document.getElementById('video-source');
var loadButton = document.getElementById('load-button');
var player = document.getElementById('player');
var historyList = document.getElementById('history-list');

loadButton.addEventListener('click', function() {
    var videoSource = videoSourceInput.value;
    loadM3U8Player(videoSource);
});

historyList.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        var selectedM3U8 = event.target.textContent;
        videoSourceInput.value = selectedM3U8;
    }
});

// 读取本地存储中的历史记录
document.addEventListener('DOMContentLoaded', function() {
    var history = JSON.parse(localStorage.getItem('m3u8History')) || [];
    history.forEach(function(item) {
        addToHistoryList(item);
    });
});

function loadM3U8Player(videoSource) {
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSource);
        hls.attachMedia(player);
        player.play();
        saveToHistory(videoSource);
    } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = videoSource;
        player.addEventListener('canplaythrough', function() {
            player.play();
        });
        saveToHistory(videoSource);
    } else {
        alert('您的浏览器不支持 m3u8 视频播放。请使用支持 HLS 的浏览器。');
    }
}

function saveToHistory(videoSource) {
    var history = JSON.parse(localStorage.getItem('m3u8History')) || [];
    
    // 检查 videoSource 是否已经存在于 history 数组中
    if (!history.includes(videoSource)) {
        history.unshift(videoSource);
        localStorage.setItem('m3u8History', JSON.stringify(history));
        addToHistoryList(videoSource);
    }
}

function addToHistoryList(videoSource) {
    var listItem = document.createElement('li');
    listItem.textContent = videoSource;
    historyList.appendChild(listItem);
}
