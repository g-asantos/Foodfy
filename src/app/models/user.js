const db = require('../config/db')
const {date} = require('../lib/utils')
const crypto = require('crypto')
const { hash } = require('bcryptjs')
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

        }


}