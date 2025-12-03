class UserDTO {
	constructor({ user, id, username, email, role, password }) {
		this.id = user.userId
		this.username = user.username
		this.email = user.email
		this.role = user.role
		this.password = user.password
	}
}

export {
	UserDTO
}