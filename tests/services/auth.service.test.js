import { clearUsers, clearTokens } from '../setup/db.js'
import { AuthService } from '../../service/auth.service.js'

const service = new AuthService()

afterAll(async() => {
	await clearTokens();
	await clearUsers();
}) 	

describe('Auth Service Test', () => {
	it(`Register a user`, async () => {
		const user = await service.register('husainamat', 'husain@mail.com', 'husain123')

		expect(user.email).toBe(`husain@mail.com`)
		expect(user.passwordHash).toBeUndefined();
	})

	it(`Login a user`, async () => {
		const user = await service.login('husain@mail.com', 'husain123');

		expect(user.accessToken).toBeDefined();
		expect(user.refreshToken).toBeDefined();
	})
});