class RegisterDTO {
	constructor(username, email, password, role = 'user') {
		if ( typeof username !== 'string' || username.length < 8  ) {
			throw Error(`username must be string and the length minimal 8 character`)
		}

		if ( password.length < 8 ) {
			throw Error(`password length must be over 8 character`)
		}

		if ( typeof email !== 'string' || email.length <= 0 ) {
			throw Error(`email must be a string and email cannot be blank`)
		}

		this.username = username;
		this.password = password;
		this.email = email;
		this.role = 'user'
	}
}

export {
	RegisterDTO
}