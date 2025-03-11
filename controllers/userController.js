const userModel = require('../models/userModel');

const userController = {
    async createUser(req, res) {
        try {
            const { name, age, email } = req.body;
            if (!name || !age || !email) {
                return res.status(400).json({ 
                    error: '请提供完整的用户信息（姓名、年龄、邮箱）' 
                });
            }
            const result = await userModel.createUser(name, age, email);
            res.json({ message: '用户创建成功', userId: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await userModel.getAllUsers();
            res.json({ users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userModel.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: '用户不存在' });
            }
            res.json({ user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, age, email } = req.body;
            if (!name || !age || !email) {
                return res.status(400).json({ 
                    error: '请提供完整的用户信息（姓名、年龄、邮箱）' 
                });
            }
            const result = await userModel.updateUser(id, { name, age, email });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: '用户不存在' });
            }
            res.json({ message: '用户更新成功' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userModel.deleteUser(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: '用户不存在' });
            }
            res.json({ message: '用户删除成功' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;