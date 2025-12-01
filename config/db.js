import { Pool } from 'pg'

const pool = new Pool ({
	user: 'husain',
	host: 'localhost',
	database: 'auth',
	password: '123',
	port: 5432
});

export {
	pool
}