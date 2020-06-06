const User = require('../models/user')
const db = require('../config/db')
const mailer = require('../lib/mailer')
const crypto = require('crypto')
const File = require('../models/file')

module.exports = {
    registerForm(req, res) {


        return res.render('user/register')
    },
    async post(req, res) {

        const { name, email } = req.body
        
        const token = crypto.randomBytes(20).toString("hex")

        try{
            if (req.body.admin) {
                const userId = await User.create({ name, email, is_admin: true, password: token })
                
    
                
                
                let now = new Date()
                now = now.setHours(now.getHours() + 1)
    
                await User.newUpdate(userId.rows[0].id, {
                    reset_token: token,
                    reset_token_expires: now
                })
                await mailer.sendMail({
                    to: email,
                    from: 'no-reply@foodfy.com.br',
                    subject: 'Escolha sua senha',
                    html: `<h2>Bem vindo!</h2>
                <p>Clique no link abaixo para definir sua senha</p>
                <p> <a href='localhost:5000/users/admin/profile?token=${token}' target="_blank"> DEFINIR SENHA</a>  </p>
                `
                })
                
                return res.redirect('/users/admin/users')
    
            } else {
                const userId = await User.create({ name, email, is_admin: false, password: token })
                
    
                let now = new Date()
                now = now.setHours(now.getHours() + 1)
    
                await User.newUpdate(userId.rows[0].id, {
                    reset_token: token,
                    reset_token_expires: now
                })
                await mailer.sendMail({
                    to: email,
                    from: 'no-reply@foodfy.com.br',
                    subject: 'Escolha sua senha',
                    html: `<h2>Bem vindo!</h2>
                <p>Clique no link abaixo para definir sua senha</p>
                <p> <a href='localhost:5000/users/admin/profile?token=${token}' target="_blank"> DEFINIR SENHA</a>  </p>
                `
                })
                
                return res.redirect('/users/admin/users')
            }
        }catch(err){
            console.error(err)
        }
        




    },
    async edit(req, res) {


        try{
            const { userId: id } = req.session
        const userEmail = await db.query(`SELECT users.email FROM users WHERE id = $1`, [id])


        const user = await User.findOne({ email: userEmail.rows[0].email })

        if (!user) return res.render('user/edit', {
            error: 'Usuário não encontrado'
        })



        return res.render('user/edit', { user, session: req.session })
        }catch(err){
            console.error(err)
        }
        
    },
    async list(req, res) {

        const users = await db.query('SELECT users.* FROM users')

        const results = users.rows
        
        
        
        
        req.session.save(() => {
            return res.render('admin/users', { results, session: req.session })
        })
        
    },
    async recipes(req,res){

        const users = await db.query('SELECT recipes.* FROM recipes WHERE user_id = $1', [req.session.userId])

        const results = users.rows
        
        
        req.session.save(() => {
            return res.render('admin/recipes', { results, session: req.session })
        })
        



    },
    async editForm(req, res) {
        const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id])





        return res.render('user/edit', { user: user.rows[0] })
    },
    async put(req, res) {
        const { name, email, id, isAdmin } = req.body

        try {

            await User.newUpdate(id, {
                name,
                email
            })


            if (isAdmin == 'true') {
                return res.redirect('/users/admin/users')
            } else {
                return res.redirect('/users/admin/users')
            }

        } catch (err) {
            console.error(err)
        }


    },
    async delete(req, res) {


        try {           
            
            let recipes_id = await db.query('SELECT id FROM recipes WHERE user_id = $1', [req.params.id])
            
            
                for(let i = 0; i < recipes_id.rows.length; i++){
                    
                    let recipe_files_id = await db.query('SELECT id FROM recipe_files WHERE recipe_id = $1 ', [recipes_id.rows[i].id])
                    .then(async (results) => { 
                        
                        
                        for(let i = 0; i < results.rows.length; i++){
                            
                            
                            
                            let files_id = await File.delete(results.rows[i].id)
                            .then( async (results) => {
                                

                                for(let i = 0; i < results.rows.length; i++){
                                    await db.query('DELETE FROM files WHERE id = $1', [results.rows[i].file_id])
                                }

                                
                                
                            })



                        }
                        
                        
                        
                        
                        }) 
                    
                    
                }
            
            
           
            
            

            await db.query('DELETE FROM users WHERE users.id = $1', [req.params.id])
            
            

            return res.redirect('../../admin/users')


        } catch (err) {
            console.error(err)
        }


    }




}





