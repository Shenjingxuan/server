const userId = Math.random().toString(36).substr(2, 9);
// 修改 WebSocket 连接
const ws = new WebSocket(`ws://${window.location.host}?userId=${userId}`);
const messagesDiv = document.getElementById('messages');

ws.onopen = () => {
    console.log('WebSocket 连接已建立');
    appendMessage('系统', '已连接到聊天室');
};

ws.onclose = () => {
    appendMessage('系统', '与聊天室的连接已断开');
};

ws.onerror = (error) => {
    console.error('WebSocket 错误:', error);
    appendMessage('系统', '连接发生错误');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'system') {
        appendMessage('系统', data.message);
    } else if (data.type === 'chat') {
        appendMessage(data.username, data.message);
    }
};

function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = sender === '系统' ? 'system-message' : 'chat-message';
    messageElement.innerHTML = `
        <span class="username">${sender}:</span>
        <span class="message">${message}</span>
    `;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message && ws.readyState === WebSocket.OPEN) {
        try {
            const messageData = {
                type: 'chat',
                message: message
            };
            console.log('发送消息:', JSON.stringify(messageData)); // 调试日志
            ws.send(JSON.stringify(messageData));
            input.value = '';
        } catch (error) {
            console.error('发送消息失败:', error);
            appendMessage('系统', '发送消息失败，请重试');
        }
    }
}

function changeName() {
    const input = document.getElementById('nameInput');
    const name = input.value.trim();
    if (name && ws.readyState === WebSocket.OPEN) {
        try {
            const messageData = {
                type: 'rename',
                name: name
            };
            console.log('发送改名请求:', JSON.stringify(messageData)); // 调试日志
            ws.send(JSON.stringify(messageData));
            input.value = '';
        } catch (error) {
            console.error('改名失败:', error);
            appendMessage('系统', '改名失败，请重试');
        }
    }
}

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('changeNameButton').addEventListener('click', changeName);
document.getElementById('messageInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});