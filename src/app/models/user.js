const db = require('../config/db')
const {date} = require('../lib/utils')
const crypto = require('crypto')
const { hash } = require('bcryptjs')

module.exports = {
        async findOne({email}){
                                

            const results = await db.query('SELECT * FROM users WHERE users.email = $1', [email])
            
            return results.rows[0]
        },
        async create({ name, email, is_admin}) {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    is_admin,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            
            `


            const password = crypto.randomBytes(20).toString('hex');
            

            const values = [
                name,
                email,
                password,
                is_admin,
                date(Date.now()).iso
            ]
    
    
            const results = await db.query(query, values)
            
            return results.rows[0].id


        },
        async update({ name, email, password, id}) {
            const query = `
                UPDATE users SET 
                    name=($1),
                    email=($2),
                    password=($3)
                WHERE id = $4
            
            `


            const passwordHash = await hash(password, 8)
            

            const values = [
                name,
                email,
                passwordHash,
                id
            ]
            
    
            const results = await db.query(query, values)
            

            return results
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