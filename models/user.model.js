import { pool } from '../config/db.js';

const model = `CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
	password TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);
`

const result = await pool.query(model)

export {
	result
}