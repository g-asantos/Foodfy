const db = require('../config/db')
const Recipe = require('../models/recipe')
const File = require('../models/file')
const fs = require('fs')
const { date } = require('../lib/utils')

module.exports = {
    async index(req, res) {

        let allRecipes = Recipe.all(async function (recipes) {
            let files = []
            for (let i = 0; i < recipes.length; i++) {


                let results = await Recipe.files(recipes[i].id)
                let filesResults = results.rows

                


                files.push(filesResults)

                
            }
            
            for (let i = 0; i < files.length; i++) {
                
                let newImages = files[i][0].path.replace(/public/i, '')



                files[i][0].path = newImages
            }




            return res.render('recipes/index', { recipes, files })



        })




    },
    async receitas(req, res) {
        const { filter } = req.query

        if (filter) {
            Recipe.findBy(filter, async function (recipes) {
                let files = []
                for (let i = 0; i < recipes.length; i++) {


                    let results = await Recipe.files(recipes[i].id)
                    let filesResults = results.rows




                    files.push(filesResults)

                }
                for (let i = 0; i < files.length; i++) {
                    let newImages = files[i][0].path.replace(/public/i, '')
    
    
    
                    files[i][0].path = newImages
                }

                return res.render('recipes/receitas', { recipes, files, filter })



            })



        } else {

            Recipe.all(async function (recipes) {
                let files = []
                for (let i = 0; i < recipes.length; i++) {


                    let results = await Recipe.files(recipes[i].id)
                    let filesResults = results.rows




                    files.push(filesResults)

                }
                for (let i = 0; i < files.length; i++) {
                    let newImages = files[i][0].path.replace(/public/i, '')
    
    
    
                    files[i][0].path = newImages
                }
                return res.render('recipes/receitas', { recipes, files })



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
                path: file.path.replace(/public/i, '')
            }))
           

            return res.render('recipes/detalhes', { recipe, files })
        })


    },
    create(req, res) {

        Recipe.chefsSelectOptions(function (options) {
            return res.render('recipes/create', { chefsOptions: options })
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

        let { ingredients, preparation } = req.body

        ingredients = `{${ingredients}}`
        preparation = `{${preparation}}`


        let results = await Recipe.create({
            ...req.body,
            ingredients,
            preparation,
            user_id: req.session.userId,
            created_at: date(Date.now()).iso
        })
        const recipeId = results.rows[0].id


        const filesPromise = req.files.map(file => File.create({
            name: file.filename,
            path: file.path

        }))

        const fileId = await Promise.all(filesPromise)


        const data = [recipeId]
        let resultsRecipeId = await Promise.all(data)


        for (let i = 0; i < fileId.length; i++) {

            File.join({ recipe_id: resultsRecipeId[0], file_id: fileId[i].rows[0].id })
        }






        return res.redirect(`/users/admin/users`)





    },
    async edit(req, res) {
        let recipe = Recipe.find(req.params.id, function (recipe) {
            if (!recipe) return res.send('Recipe not found!')

            req.session.recipeCreator = recipe.user_id
            Recipe.chefsSelectOptions(async function (options) {
                let results = await Recipe.files(recipe.id)
                let files = results.rows

                files = files.map(file => ({
                    ...file,
                    path: file.path.replace(/public/i, '')
                }))


                req.session.save(() => {
                    return res.render('recipes/edit', { recipe, chefsOptions: options, files })
                })

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
                File.create({
                    name: file.filename,
                    path: file.path
                }))

            const fileResults = await Promise.all(newFilesPromise)



            for (let i = 0; i < fileResults.length; i++) {

                File.join({ recipe_id: req.body.id, file_id: fileResults[i].rows[0].id })
            }

        }


        let { ingredients, preparation, title, chef, information } = req.body

        ingredients = `{${ingredients}}`
        preparation = `{${preparation}}`


        await Recipe.update(req.body.id, {
            title,
            chef_id: chef,
            information,
            ingredients,
            preparation

        })


        req.session.save(() => {
            return res.redirect(`/receitas/${req.body.id}`)
        })

    },
    async delete(req, res) {
        try {
            const file_id = await Recipe.delete(req.body.id, async (results) => {

                for (let i = 0; i < results.length; i++) {


                    const result = await db.query(`SELECT * FROM files
                    WHERE id = $1`, [results[i].file_id])

                    let destination = await Promise.resolve(result)




                    fs.unlinkSync(destination.rows[0].path)
                }


                await Recipe.finalDelete(req.body.id)

                for (let i = 0; i < results.length; i++) {


                    let deleteFile = await db.query(`DELETE FROM files WHERE id = $1`, [results[i].file_id])
                }

            })


            req.session.save(() => {
                return res.redirect(`/users/admin/users`)
            })
        } catch (err) {
            console.error(err)
        }






    },



}
