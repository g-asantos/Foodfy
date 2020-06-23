const db = require('../config/db')
const Base = require('./Base')

Base.init({table: 'users'})


module.exports = {
	...Base,
	async findOne({email}){
                                

		const results = await db.query('SELECT * FROM users WHERE users.email = $1', [email])
            
		return results.rows[0]
	},
	async newUpdate(id,fields){
		let query = 'UPDATE users SET'

		Object.keys(fields).map((key, index,array) => {
			if((index + 1) < array.length){
				query = `${query}
                    ${key} = '${fields[key]}',`
			} else {
				query = `${query} 
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}`
			}
		})
            
		await db.query(query)
         
		return 

	},
	async adminStatus(id){
		let admin_data = await db.query('SELECT users.is_admin FROM users WHERE users.id = $1', [id])
            
		return admin_data.rows[0].is_admin
               
	}

}