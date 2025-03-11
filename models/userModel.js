const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'myapp'
});

class UserModel {
    async createUser(name, age, email) {
        const [result] = await pool.execute(
            'INSERT INTO users (name, age, email) VALUES (?, ?, ?)',
            [name, age, email]
        );
        return result;
    }

    async getAllUsers() {
        const [rows] = await pool.execute('SELECT * FROM users');
        return rows;
    }

    async getUserById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    async updateUser(id, data) {
        const { name, age, email } = data;
        const [result] = await pool.execute(
            'UPDATE users SET name = ?, age = ?, email = ? WHERE id = ?',
            [name, age, email, id]
        );
        return result;
    }

    async deleteUser(id) {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return result;
    }
}

module.exports = new UserModel();