import bcrypt from 'bcrypt';
import { pool as users } from '../models/user.model.js';
import { pool as token } from '../models/token.model.js';
import { TokenService } from './token.service.js';
import { RegisterDTO } from '../dtos/register.dto.js';
import { TokenDTO } from '../dtos/token.dto.js';
import { UserDTO } from '../dtos/user.dto.js';

class AuthService {
	async register(username, email, password) {
		const validation = new RegisterDTO(username, email, password);
		const exist = await users.query(`SELECT * FROM users WHERE email = ${email}`);

		if ( exist.rows[0] ) throw Error(`email already register`);

		const hashPassword = await bcrypt.hash(password, 10);

		const user = await users.query(`INSERT INTO users (username, email, password) VALUES(${username}, ${email}, ${hashPassword})`);

		const response = new UserDTO(user.rows[0])
		return response
	}

	async login (email, password) {
		const user = await users.query(`SELECT * FROM users WHERE email = ${email}`)

		if ( user.rowCount <= 0 ) throw Error(`invalid credentials`)

			const match = await bcrypt.compare(password, user.rows[0].password)

		if ( !match ) throw Error(`invalid credentials`);
		const tokenService = new TokenService()
		const accesToken = tokenService.generateAcessToken(user)
		const refreshToken = await tokenService.generateRefreshToken(user);

		const response = new TokenDTO(user, accesToken, refreshToken) 
		return response
	}

	async refreshToken(oldToken) {
		const tokenService = new TokenService()
		const saved = await tokenService.rotateRefreshToken(oldToken);

		if ( !saved ) throw Error(`Invalid credentials`);

		const user = await users.query(`SELECT * FROM users WHERE id = ${saved.rows[0].userId}`);

		if ( user.rowCount <= 0 ) throw Error(`User not found`);

		const acessToken = tokenService.generateAcessToken(user);

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