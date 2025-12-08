import { AuthService } from '../service/auth.service.js'
import { LoginDTO } from '../dtos/login.dto.js'
import { success, error } from '../utils/response.util.js'
const authService = new AuthService()

class AuthController {
	async register (req, res, next) {
		try {
			const { username, email, password } = req.body
			const user = await authService.register(username, email, password)
			success(res, user, 201)
		} catch (err) {
			error(res, err, 400)
		}
	}

	async login (req, res) {
		try {
			const { email, password } = req.body

			const user = await authService.login(email, password)
			success(res, user, 200)
		} catch(err) {
			error(res, err, 400)
		}
	}

	async refreshToken(req, res) {
		try {
			const {token} = req.body 
			const rotated = await authService.refreshToken(token)

			success(res, rotated, 200)

		} catch (err) {
			error(res, err, 400)
		}
	}

	async logout (req, res) {
		try {
			await authService.logout(req.body)
			success(res, user, 200)
		} catch (err) {
			error(res, err, 400)
		}
	}
}

export {
	AuthController
}