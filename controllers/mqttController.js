const mqttClient = require('../utils/mqtt');

const mqttController = {
    async publishMessage(req, res) {
        try {
            const { topic, message } = req.body;
            if (!topic || !message) {
                return res.status(400).json({ 
                    error: '需要提供 topic 和 message' 
                });
            }
            
            await mqttClient.publish(topic, JSON.stringify(message));
            res.json({ 
                message: '消息发布成功', 
                topic, 
                content: message 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async subscribe(req, res) {
        try {
            const { topic } = req.body;
            if (!topic) {
                return res.status(400).json({ 
                    error: '需要提供 topic' 
                });
            }
            
            await mqttClient.subscribe(topic);
            res.json({ 
                message: '订阅成功', 
                topic 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = mqttController;