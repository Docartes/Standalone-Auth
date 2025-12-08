import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import { TokenService } from './token.service.js';
import { RegisterDTO } from '../dtos/register.dto.js';
import { TokenDTO } from '../dtos/token.dto.js';
import { UserDTO } from '../dtos/user.dto.js';
import { hash, comparedPassword } from '../utils/password.util.js';

class AuthService {
	async register(username, email, password) {
		const validation = new RegisterDTO(username, email, password);
		const exist = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

		if ( exist.rows[0] ) throw Error(`email already register`);

		const hashPassword = await hash(password);

		await pool.query(`INSERT INTO users (username, email, password) VALUES($1, $2, $3)`, [username, email, hashPassword]);

		const user = await pool.query(`SELECT * FROM users WHERE username = $1`, [username])

		const response = new UserDTO(user.rows[0])
		return response
	}

	async login (email, password) {
		const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])

		if ( user.rowCount <= 0 ) throw Error(`invalid credentials`)

			const match = await comparedPassword(password, user.rows[0].password)

		if ( !match ) throw Error(`invalid credentials`);
		const tokenService = new TokenService()
		const accesToken = await tokenService.generateAcessToken(user)
		const refreshToken = await tokenService.generateRefreshToken(user);

		const response = new TokenDTO(user, accesToken, refreshToken) 
		return response
	}

	async refreshToken(oldToken) {
		const tokenService = new TokenService()
		const saved = await tokenService.rotateRefreshToken(oldToken);

		if ( !saved ) throw Error(`Invalid credentials`);

		const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [saved.userId]);

		if ( user.rowCount <= 0 ) throw Error(`User not found`);

		const acessToken = await tokenService.generateAcessToken(user);

		return {
			acessToken,
			refreshToken: saved.newToken
		}
	}

	async logout (refreshToken) {
		const tokenService = new TokenService()
		await tokenService.revokeRefreshToken(refreshToken)
	}
}

export {
	AuthService
}