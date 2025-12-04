class TokenDTO {
	constructor ({user, accessToken, refreshToken}) {
		this.user = user;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}

export {
	TokenDTO
}