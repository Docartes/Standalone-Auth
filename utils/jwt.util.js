import jwt from 'jsonwebtoken';

export const signAccessToken = async (payload) => {
	return await jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '15m'})
}

export const verifyAccessToken = async (token) => {
	return await jwt.verify(token, process.env.TOKEN_SECRET)
}