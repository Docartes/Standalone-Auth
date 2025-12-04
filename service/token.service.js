import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { signAccessToken, verifyAccessToken } from '../utils/jwt.util.js';
import crypto from 'crypto';


class TokenService {
	generateAcessToken(user) {
		return signAccessToken({
			id: user.rows[0].id,
			role: user.rows[0].role})
	}

	async generateRefreshToken (user) {
		const token = await crypto.randomBytes(40).toString('hex');

		const userId = user.rows[0].id;
		const expiresDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

		await pool.query(`INSERT INTO refreshToken (userId, token) VALUES(${userId}, ${token}, ${expiresDate})`);


		return token
	}

	async rotateRefreshToken(oldToken) {
		const saved = await pool.query(`SELECT * FROM refreshToken WHERE token = ${oldToken}`)

		if ( saved.rowCount <= 0 ) {
			return null
		}

		await pool.query(`DELETE FROM refreshToken WHERE token = ${oldToken}`);

		const token = await crypto.randomBytes(40).toString('hex');

		const userId = saved.rows[0].id;
		const expiresDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

		await pool.query(`INSERT INTO refreshToken (userId, token) VALUES(${userId}, ${token}, ${expiresDate})`);


		return { userId: saved.rows[0].userId, newToken: token }
	}

	async revokeRefreshToken(token) {
		await pool.query(`DELETE FROM refreshToken WHERE token = ${token}`);
	}
}

export {
	TokenService
}