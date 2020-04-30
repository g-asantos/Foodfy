const db = require('../config/db')
const Recipe = require('../models/recipe')
const File = require('../models/file')
const fs = require('fs')

module.exports = {
    async index(req, res) {

        let allRecipes = Recipe.all(async function (recipes) {
            let files = []
            for(let i = 0; i < recipes.length; i++){

            
            let results = await Recipe.files(recipes[i].id)
            let filesResults = results.rows
            

            
                
            files.push(filesResults)
            
            }
            
            	
            return res.render('user/index', { recipes, files})
        

            
        })
        

        

    },
    async receitas(req, res) {
        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, async function (recipes) {
                let files = []
                    for(let i = 0; i < recipes.length; i++){
        
                    
                    let results = await Recipe.files(recipes[i].id)
                    let filesResults = results.rows
                    
        
                    
                        
                    files.push(filesResults)
                    
                    }
                    
                        
                    return res.render('user/receitas', { recipes, files, filter})
                
        
                    
                })



        } else {
            
                Recipe.all(async function (recipes) {
                    let files = []
                    for(let i = 0; i < recipes.length; i++){
        
                    
                    let results = await Recipe.files(recipes[i].id)
                    let filesResults = results.rows
                    
        
                    
                        
                    files.push(filesResults)
                    
                    }
                    
                        
                    return res.render('user/receitas', { recipes, files})
                
        
                    
                })
            

        }

    },
    async show(req, res) {

        let recipe = Recipe.find(req.params.id, async function (recipe) {
            if (!recipe) return res.send('Recipe not found!')
            
            let results = await Recipe.files(recipe.id)
            let files = results.rows

            files = files.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}/images/`
            }))

            

            return res.render('user/detalhes', { recipe, files })
        })


    },
    create(req, res) {

        Recipe.chefsSelectOptions(function (options) {
            return res.render('user/create', { chefsOptions: options })
        })


    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Please fill all fields')
            }
        }


        if (req.files.length == 0)
            return res.send('Please, send at least one image')


        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id


        const filesPromise = req.files.map(file => File.create({
            ...file,

        }))

        const fileId = await Promise.all(filesPromise)


        const data = [recipeId]
        let resultsRecipeId = await Promise.all(data)


        for (let i = 0; i < fileId.length; i++) {

            File.join({ recipe_id: resultsRecipeId[0], file_id: fileId[i].rows[0].id })
        }






        return res.redirect(`/receitas/${recipeId}`)




    },
    async edit(req, res) {
        let recipe = Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send('Recipe not found!')

            Recipe.chefsSelectOptions(async function (options) {
                let results = await Recipe.files(recipe.id)
                let files = results.rows

                files = files.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}/images/`
                }))
                return res.render('user/edit', { recipe, chefsOptions: options, files })
            })


        })
    },
    async put(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '' && key != 'removed_files') {
                return res.send('Please fill all fields')
            }
        }



        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            const results = await Promise.all(removedFilesPromise)

            for (let i = 0; i < results.length; i++) {


                let removeFileRegistry = await db.query(`DELETE FROM files WHERE files.id = $1`, [results[i].rows[0].file_id])
            }



        }

        if (req.files.length != 0) {



            const newFilesPromise = req.files.map(file =>
                File.create({ ...file }))

            const fileResults = await Promise.all(newFilesPromise)



            for (let i = 0; i < fileResults.length; i++) {

                File.join({ recipe_id: req.body.id, file_id: fileResults[i].rows[0].id })
            }

        }

        await Recipe.update(req.body)


        return res.redirect(`/receitas`)
    },
    async delete(req, res) {



        const file_id = await Recipe.delete(req.body.id, async (results) => {
            

            for(let i = 0; i < results.length; i++){
                 
                
                const result = db.query(`SELECT * FROM files
                WHERE id = $1`, [results[i].file_id])
                
                let destination = await Promise.resolve(result)
                
                


                fs.unlinkSync(destination.rows[0].path)
            }



            for (let i = 0; i < results.length; i++) {
                

                let deleteFile = db.query(`DELETE FROM files WHERE id = $1`, [results[i].file_id])
            }

        })

        const recipeDelete = await db.query(`DELETE FROM recipes WHERE id = $1`, [req.body.id])


        return res.redirect(`/`)
    },



}
