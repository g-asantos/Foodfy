const { date } = require('../lib/utils')
const db = require('../config/db')
const Chef = require('../models/chef')
const File = require('../models/file')
const fs = require('fs')

module.exports = {
    async index(req, res) {

        Chef.all(async function (chefs) {
            let files = []
            for (let i = 0; i < chefs.length; i++) {
                let results = await db.query(`SELECT * FROM files WHERE files.id = $1`, [chefs[i].file_id])

                files.push(results.rows)
            }

            

            return res.render('chefs/index', { chefs, files })
        })

    },
    async chefs(req, res) {
        Chef.all(async function (chefs) {
            let files = []
            for (let i = 0; i < chefs.length; i++) {
                let results = await db.query(`SELECT files.* FROM files
            JOIN chefs ON files.id = chefs.file_id

            
            
            
            WHERE files.id= $1`, [chefs[i].file_id])

                files.push(results.rows[0])
                
            }
            
            for (let i = 0; i < files.length; i++) {
                let newImages = files[i].path.replace(/public/i, '')



                files[i].path = newImages
            }
            return res.render('recipes/chefs', { chefs, files })
        })


    },
    async show(req, res) {

        Chef.find(req.params.id, async function (chef) {
            if (!chef) return res.send('Chef not found!')
            let results = await db.query(`SELECT * FROM files WHERE files.id = $1`, [chef.file_id])

            let chefFiles = results.rows[0].path
            chefFiles = chefFiles.replace(/public/i, '')
            Chef.recipesMade(async function (recipes) {
                
                let recipeFiles = []
                for (let i = 0; i < recipes.length; i++) {
                    let fileResults = await db.query(`SELECT * FROM recipes  
                    WHERE recipes.chef_id = $1 ORDER BY recipes.created_at DESC`, [recipes[i].chef_id])
                    
                    
                    let recipe_filesResults = await db.query(`SELECT * FROM recipe_files WHERE recipe_files.recipe_id = $1`,
                    [fileResults.rows[0].id])
                    
                    
                    let files = await db.query(`SELECT * FROM files WHERE files.id = $1`, [recipe_filesResults.rows[0].file_id])
                    let recipe_filesFiles = recipe_filesResults.rows


                    if (files.rows[0].id == recipe_filesFiles[0].file_id && recipes[i].id == recipe_filesFiles[0].recipe_id) {
                        recipeFiles.push(files.rows[0].path)


                    }



                }
                
                
                
                for (let i = 0; i < recipeFiles.length; i++) {
                    recipeFiles[i] = recipeFiles[i].replace(/public/i, '')
    
    
                    
                    
                }

                
                return res.render('chefs/detalhes', { chef, recipesMade: recipes, chefFiles, recipeFiles })

            })


        })


    },
    recipes(req, res) {
        Chef.find(req.params.id, function (chef) {
            if (!chef) return res.send('Chef not found!')

            Chef.recipesMade(function (recipes) {
                return res.render('chefs/show', { chef, recipesMade: recipes })
            })


        })

    },
    create(req, res) {
        return res.render('chefs/create')
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






        const filesPromise = req.files.map(file => File.create({
            name: file.filename,
            path: file.path
            
        }))

        const fileId = await Promise.all(filesPromise)

        let results = await Chef.create({ name: req.body.name, file_id: fileId[0].rows[0].id,
        created_at: date(Date.now()).iso })







        return res.redirect(`/chefs/`)




    },
    async edit(req, res) {

        Chef.edit(req.params.id, function (chef) {
            if (!chef) return res.send('Chef not found!')

            return res.render('chefs/edit', { chef })
        })

    },
    async put(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Please fill all fields')
            }
        }


        const fileGet = await db.query(`SELECT chefs.*,files.* 
        FROM chefs JOIN files ON chefs.file_id = files.id WHERE chefs.id = $1`,
            [req.body.id])

        const filesPromise = req.files.map(file => File.create({
            name: file.filename,
            path: file.path

        }))

        const fileId = await Promise.all(filesPromise)

        if (fileId == '') {
            return res.send('Please select a photo')
        }

        let chefsUpdate = await Chef.update(req.body.id, { file_id: fileId[0].rows[0].id, name: req.body.name }, async () =>{

            

            await db.query(`DELETE FROM files WHERE files.path = $1`, [req.body.file_id])
        })
        
        
     
       
            fs.unlinkSync(req.body.file_id)
            
        


            req.session.save(() => {
                return res.redirect(`chefs/${req.body.id}`)
            })
            


        
        
        
        
       
        
       






        

        


        



    },
    async delete(req, res) {

        const chefDelete = await Chef.delete(req.body.id, async (results) => {


            const files = await db.query(`SELECT * FROM files WHERE id = $1`, [results.rows[0].file_id])

            fs.unlinkSync(files.rows[0].path)


            const fileDeletion = await db.query(`DELETE FROM files WHERE id = $1`, [results.rows[0].file_id])
        })





        return res.redirect(`chefs`)
    },



}
