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

		await pool.query(`INSERT INTO refreshToken (userId, token, expiresAt) VALUES($1, $2, $3)`, [userId, token, expiresDate]);


		return token
	}

	async rotateRefreshToken(oldToken) {
		const saved = await pool.query(`SELECT * FROM refreshtoken WHERE token = $1`, [oldToken])
		const userId = saved.rows[0].userid;

		if ( saved.rowCount <= 0 ) {
			return null
		}

		const token = await crypto.randomBytes(40).toString('hex');

		const expiresDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

		await pool.query(`INSERT INTO refreshToken (userid, token, expiresat) VALUES($1, $2, $3)`, [userId, token, expiresDate]);

		await pool.query(`DELETE FROM refreshToken WHERE userId = $1`, [userId]);

		return { userId, newToken: token }
	}

	async revokeRefreshToken(token) {
		await pool.query(`DELETE FROM refreshToken WHERE token = $1`, [token]);
	}
}

export {
	TokenService
}