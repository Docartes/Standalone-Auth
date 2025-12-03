import { AuthService } from '../service/auth.service.js'
import { LoginDTO } from '../dtos/login.dto.js'
const authService = new AuthService()

class AuthController {
	async register (req, res, next) {
		try {
			const { username, email, password } = req.body
			const user = await authService.register(username, email, password)

			res.status(201).json({
				status: 'ok',
				code: 201,
				data: user
			})
		} catch (err) {
			res.status(400).json({
				code: 400,
				meesage: err
			});
		}
	}

	async login (req, res) {
		try {
			const { email, password } = req.body

			const user = await authService.login(email, password)

			res.status(200).json({
				status: 'ok',
				code: 200,
				data: user
			})
		} catch(err) {
			res.status(400).json({
				code: 400,
				meesage: err
			});
		}
	}

	async refreshToken(req, res) {
		try {
			const rotated = await authService.refreshToken(req.body)

			res.status(200).json({
				status: 'ok',
				code: 200,
				data: rotated
			})

		} catch (err) {
			res.status(400).json({
				code: 400,
				meesage: err
			});
		}
	}

	async logout (req, res) {
		try {
			await authService.logout(req.body)
			res.status(200).json({
				status: 'ok',
				code: 200,
				meesage: 'logout success'
			})
		} catch (err) {
			res.status(400).json({
				code: 400,
				meesage: err
			});
		}
	}
}

export {
	AuthController
}