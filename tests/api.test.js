const request = require('supertest');
const app = require('../app');
const mysql = require('mysql2/promise');
const mqttClient = require('../utils/mqtt');

let pool;

beforeAll(async () => {
    // 创建测试数据库连接
    pool = await mysql.createPool({
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: 'your_password',
        database: 'myapp'
    });

    // 确保表存在
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            age INT NOT NULL,
            email VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    mqttClient.connect();
});

afterAll(async () => {
    // 清理测试数据
    await pool.execute('DELETE FROM users');
    await pool.end();
    await mqttClient.disconnect();
    await new Promise(resolve => setTimeout(resolve, 500)); // Give time for MQTT to cleanup
});

describe('API 测试', () => {
    // MQTT 测试
    describe('MQTT API', () => {
        it('应该能发布消息', async () => {
            const res = await request(app)
                .post('/api/mqtt/publish')
                .send({
                    topic: 'test/topic',
                    message: 'test message'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', '消息发布成功');
        });

        it('应该能订阅主题', async () => {
            const res = await request(app)
                .post('/api/mqtt/subscribe')
                .send({
                    topic: 'test/topic'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', '订阅成功');
        });
    });

    // 用户 API 测试
    describe('用户 API', () => {
        it('应该能创建新用户', async () => {
            const res = await request(app)
                .post('/api/users/create')
                .send({
                    name: '测试用户',
                    age: 25,
                    email: 'test@example.com'
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', '用户创建成功');
        });

        it('应该能获取所有用户', async () => {
            const res = await request(app)
                .get('/api/users/all');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.users)).toBeTruthy();
        });
    });
});