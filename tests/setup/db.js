import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool ({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT
});

export const clearTokens = async () => {
	const query = `DELETE FROM refreshToken;`
	return await pool.query(query)
}

export const clearUsers = async () => {
	const query = `DELETE FROM users;`
	return await pool.query(query)
}
