import { pool } from '../config/db.js'

const users = await pool.query(`SELECT  * FROM users`)

class LoginDTO {
	constructor (email, password) {
		if ( email.length < 8 || password.length < 8 ) {
			throw Error(`email & password field cannot be blank`)
		}

		for ( let user of users.rows ) {
			if ( email !== user.email || password !== user.password) {
				throw Error(`email and password not found, you must login first`)
			} 
		}

		this.email = email;
		this.password = password;		
	}
}

export {
	LoginDTO
}