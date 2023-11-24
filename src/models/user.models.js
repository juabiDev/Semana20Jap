import mysql2 from 'mysql2/promise';

const DEFAULT_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3307,
    database: 'semana20jap'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

const connection = await mysql2.createConnection(connectionString);

export class UserModel {

    static async login(email, password) {
        const sql = 'SELECT * FROM users WHERE email = ? AND password = ?;';
        const [rows] = await connection.execute(sql, [email, password]);

        if(rows.length === 0) return []

        return rows[0];
    }

    static async createUser(email, password) {
        try {
            const findUser = 'SELECT * FROM users WHERE email = ? AND password = ?;';
            const [user] = await connection.execute(findUser, [email, password]);
            if(user.length > 0) return false;

            const sql = 'INSERT INTO users (email, password) VALUES (?, ?);';
            await connection.execute(sql, [email, password]);
            return true;
        } catch (error) {
            throw new Error('Error creating user')
        }

    }

    static async submitProject(email, title, deploy, repo, description) {
        try {
            const userId = 'SELECT id FROM users WHERE email = ?;';
            const [user] = await connection.execute(userId, [email]);
            
            const sql = 'INSERT INTO projects (title, deploy, repo, description, idUser) VALUES (?, ?, ?, ?, ?);';
            await connection.execute(sql, [title, deploy, repo, description, user[0].id]);
            return true;
        } catch (error) {
            throw new Error('Error creating project')
        }

    }
}
