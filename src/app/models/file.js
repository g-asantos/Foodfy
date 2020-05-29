const { date } = require('../lib/utils')
const db = require('../config/db')
const fs = require('fs')
const Base = require('./Base')

Base.init({table: 'files'})


module.exports = {
    ...Base,
    join({ recipe_id, file_id }) {
        const query = `
        INSERT INTO recipe_files(
            recipe_id,
            file_id
            
            
        )
        VALUES ($1, $2)
        RETURNING id
        
      
    `

        const values = [
            recipe_id,
            file_id

        ]


        return db.query(query, values)
    },
    async delete(id) {


        try {
            const result = await db.query(`SELECT * FROM recipe_files
            JOIN files ON files.id = recipe_files.file_id
            WHERE recipe_files.id = $1`, [id])

            const file = result.rows[0]
            
            fs.unlinkSync(file.path)

            
        } catch (err) {
            console.error(err)
        }







        return db.query(`DELETE FROM recipe_files
        WHERE recipe_files.id = $1
        RETURNING file_id`, [id])
    },
    


}
