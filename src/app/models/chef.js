const { date } = require('../lib/utils')
const db = require('../config/db')



module.exports = {
    all(callback) {
        db.query(`SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes ASC`, function (err, results) {

            if (err) throw `Database error! ${err}`


            callback(results.rows)
        })

    },
    create({ name, file_id }) {
        const query = `
            INSERT INTO chefs (
                name,
                file_id,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        
        `
        const values = [
            name,
            file_id,
            date(Date.now()).iso
        ]


        return db.query(query, values, function (err) {
            if (err) throw `Database error! ${err}`


        })
    },
    find(id, callback) {
        db.query(`SELECT chefs.*,      
        count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id], function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    update(id,{file_id , name}) {
        const query = `
            UPDATE chefs SET
            file_id=($1),
            name=($2)
            WHERE id = $3
        `

        const values = [
            file_id,
            name,
            id
        ]


        db.query(query, values, function (err, results) {
            if (err) throw `Database error! ${err}`


        })



    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs USING files
        WHERE files.id = chefs.file_id
        AND chefs.id = $1
        RETURNING chefs.file_id`, [id], function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results)
        })
    },
    recipesMade(callback) {
        db.query(`SELECT title,recipes.id,chef_id FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)

        })
    },
    edit(id, callback) {
        db.query(`SELECT chefs.*, files.path
        FROM chefs
        LEFT JOIN files ON chefs.file_id = files.id
        WHERE chefs.id = $1`, [id], function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    files(id){
        return db.query(`SELECT * FROM files WHERE files.id = $1`, [id])
    }

}