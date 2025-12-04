import jwt from 'jsonwebtoken'
import { success, error } from '../utils/response.util.js'
import { verifyAccessToken } from '../utils/jwt.util.js'


export const authMiddleware = (roles = []) => {
	return (req, res, next) => {
		const authHeader = req.headers.authorization;


		if ( !authHeader && !authHeader.startsWith(`Bearer `) ) {
			error(res, {message: 'Unauthorized'}, 401)
		}	

		const token = authHeader.split(' ')[1]

		try {
			const payload = verifyAccessToken(token)
			req.user = payload

			if ( roles.length && !roles.includes(payload.role) ) {
				error(res, {message: `Forbidden`}, 403)
			}

			next();
		} catch (err) {
			error(res, {message: 'Invalid or Expires Token'}, 401)
		}
	}
}