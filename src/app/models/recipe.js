const {date} = require('../lib/utils')
const db = require('../config/db')



module.exports = {
    all(callback){
        db.query(`SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC `, function(err, results){

            if(err) throw `Database error! ${err}`

            
            callback(results.rows)
        })

    },
    create(data){
        const query = `
            INSERT INTO recipes (
                title,
                ingredients,
                preparation,
                information,
                chef_id,
                created_at,
                user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            
            
        `
        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.chef,
            date(Date.now()).iso,
            data.user_id
        ]


        return db.query(query, values)
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
    update(data){
        const query = `
            UPDATE recipes SET
            title=($1),
            ingredients=($2),
            preparation=($3),
            information=($4),
            chef_id=($5)
            WHERE id = $6
        `

        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.chef,
            data.id
        ]


        db.query(query, values, function(err, results){
            if(err) throw `Database error! ${err}`

            
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

