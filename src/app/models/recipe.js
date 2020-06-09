const {date} = require('../lib/utils')
const db = require('../config/db')
const Base = require('./Base')

Base.init({table: 'recipes'})


module.exports = {
    ...Base,
    all(callback){
        db.query(`SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC `, function(err, results){

            if(err) throw `Database error! ${err}`

            
            callback(results.rows)
        })

    },
    find(id, callback){
        db.query(`SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
        WHERE recipes.id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`
            
            callback(results.rows[0])
        })
    },
    findBy(filter,callback){
        db.query(`SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.updated_at DESC`, function(err, results){

            if(err) throw `Database error! ${err}`

            
            callback(results.rows)
        })
    },
    async delete(id, callback){
        let deletion = await db.query(`DELETE FROM recipe_files USING recipes
        WHERE recipes.id = recipe_files.recipe_id
        AND recipe_files.recipe_id = $1
        RETURNING file_id`, [id], function(err,results){
            if(err) throw `Database error! ${err}`
            
            
                
            callback(results.rows)
        })
        
    },
    chefsSelectOptions(callback){
        db.query(`SELECT name, id  FROM chefs`, function(err,results){
            if(err) throw `Database error! ${err}`

            callback(results.rows)

        })
    },
    files(id, callback){
        return db.query(`SELECT * FROM files
        JOIN recipe_files ON files.id = recipe_files.file_id
        WHERE recipe_files.recipe_id = $1
        `, [id])
    },
    async finalDelete(id){
        let deleteRecipe = await db.query(`DELETE FROM recipes WHERE id = $1`, [id])
            
        await Promise.resolve(deleteRecipe)
    }
}

