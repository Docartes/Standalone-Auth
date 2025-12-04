import { pool } from '../config/db.js'

const tokenModel = `CREATE TABLE IF NOT EXISTS refreshToken (
	userId INT NOT NULL,
	token TEXT NOT NULL,
	expiresAt TIMESTAMP NOT NULL,
	FOREIGN KEY (userID) REFERENCES users(id)
);`

const tokensTable = await pool.query(tokenModel)

export {
	tokensTable
}