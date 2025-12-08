import { clearUsers, clearTokens } from '../setup/db.js'
import request from 'supertest'

afterAll(async () => {
	await clearTokens()
	await clearUsers()
	return 0;
})

describe(`Auth Controller Test`, () => {
	test(`Register a user`, async () => {
		const res = await request(`localhost:3000`).post('/auth/register').send({
			username: 'husainamat',
			email: 'husain@mail.com',
			password: 'husain123'
		})
		// console.log(res)

		expect(res._body.data.email).toBe('husain@mail.com')
		expect(res._body.data.hashPassword).toBeUndefined()
	})

	test(`Login a user`, async () => {
		const res = await request(`localhost:3000`).post(`/auth/login`).send({
			email: 'husain@mail.com',
			password: 'husain123'
		})


		expect(res._body.data.accessToken).toBeDefined();
		expect(res._body.data.refreshToken).toBeDefined();
	})

	test(`should refresh token`, async () => {
		const login = await request(`localhost:3000`).post(`/auth/login`).send({
			email: 'husain@mail.com',
			password: 'husain123'
		})

		const res = await request(`localhost:3000`).post('/auth/refreshToken').send({
			token: login._body.data.refreshToken
		})

		expect(res._body.data.acessToken).toBeDefined();
	})
})