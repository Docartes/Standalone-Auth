export const success = (res, data, status = 200) => {
	res.status(status).json({
		status: 'ok',
		code: status,
		data
	})
}

export const error = (res, data, status = 400) => {
	res.status(status).json({
		code: status,
		data
	})
}

