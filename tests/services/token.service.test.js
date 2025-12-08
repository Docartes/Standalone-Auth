import { clearUsers, clearTokens } from '../setup/db.js'
import { TokenService } from '../../service/token.service.js'
import { AuthService } from '../../service/auth.service.js'
import { pool } from '../../config/db.js'

const tokenService = new TokenService()
const authService = new AuthService()

afterAll(async() => {
	await clearTokens();
	await clearUsers();
})

describe(`Token Service Test`, () => {
	it(`generate access token`, async () => {
		const register = await authService.register(`voldemort`, `voldemort@mail.com`, `hogwarts123`);
		const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [register.email])
		const acessToken = await tokenService.generateAcessToken(user);

		expect(acessToken).toBeDefined()
	})

	it(`generate refresh token`, async () => {
		const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [`voldemort@mail.com`]);
		const refreshToken = await tokenService.generateRefreshToken(user);

		expect(refreshToken).toBeDefined();
	})

	it(`rotate old refresh token to new refresh token`, async () => {
		const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [`voldemort@mail.com`]);
		const refreshToken = await tokenService.generateRefreshToken(user);

		const newToken = await tokenService.rotateRefreshToken(refreshToken)
		expect(refreshToken).toBeDefined();
		expect(newToken.newToken).not.toEqual(refreshToken)
	})

	it (`revoke refresh token`, async () => {
		const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [`voldemort@mail.com`]);
		const refreshToken = await tokenService.generateRefreshToken(user);
		const revoke = await tokenService.revokeRefreshToken(refreshToken);

		expect(revoke).toBeUndefined();
	})

})