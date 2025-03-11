const redisClient = require('../utils/redis');

const redisController = {
    async setValue(req, res) {
        try {
            const { key, value } = req.body;
            if (!key || !value) {
                return res.status(400).json({ error: '需要提供 key 和 value' });
            }
            
            await redisClient.set(key, value);
            res.json({ message: '数据保存成功', key, value });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getValue(req, res) {
        try {
            const { key } = req.params;
            const value = await redisClient.get(key);
            
            if (value === null) {
                return res.status(404).json({ error: '未找到该键值' });
            }
            
            res.json({ key, value });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = redisController;