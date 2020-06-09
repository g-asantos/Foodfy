const { date } = require('../lib/utils')
const db = require('../config/db')
const Base = require('./Base')

Base.init({table: 'chefs'})


module.exports = {
    ...Base,
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
        ORDER BY recipes.created_at DESC
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