const WebSocket = require('ws');
const url = require('url');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map();
        
        this.wss.on('connection', (ws, req) => {
            const userId = url.parse(req.url, true).query.userId;
            this.clients.set(ws, { id: userId, name: `用户${userId}` });

            // 广播用户加入消息
            this.broadcast({
                type: 'system',
                message: `${this.clients.get(ws).name} 加入了聊天室`
            });

            // 添加心跳检测
            ws.isAlive = true;
            ws.on('pong', () => ws.isAlive = true);

            ws.on('message', (message) => {
                try {
                    const messageStr = message.toString().trim();
                    console.log(`用户 ${userId} 发送消息:`, messageStr);
                    
                    const data = JSON.parse(messageStr);
                    // 发送给所有客户端，包括发送者
                    this.broadcast({
                        type: data.type,
                        userId: userId,
                        username: this.clients.get(ws).name,
                        message: data.message,
                        timestamp: new Date().toISOString()
                    });
                } catch (error) {
                    console.error(`用户 ${userId} 消息格式错误:`, error);
                }
            });

            ws.on('close', () => {
                const user = this.clients.get(ws);
                if (user) {
                    this.broadcast({
                        type: 'system',
                        message: `${user.name} 离开了聊天室`
                    });
                    this.clients.delete(ws);
                }
            });
        });

        // 添加心跳检测间隔
        setInterval(() => {
            this.wss.clients.forEach(ws => {
                if (!ws.isAlive) {
                    ws.terminate();
                    return;
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);
    }

    broadcast(message) {
        try {
            const data = JSON.stringify(message);
            console.log('广播消息:', data);
            
            this.wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                    console.log('消息已发送给客户端');
                }
            });
        } catch (error) {
            console.error('广播错误:', error);
        }
    }
}

module.exports = WebSocketServer;