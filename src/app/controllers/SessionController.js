const crypto  = require('crypto')
const mailer = require('../lib/mailer')
const User = require('../models/user')
const {hash} = require('bcryptjs')



module.exports = {
    loginForm(req,res){
        
        return res.render('user/login')
    },
    logout(req,res){
        req.session.destroy()
        return res.redirect('/users/login')
    },
    async login(req,res){

        try{
            let results = await User.adminStatus(req.user.id)

        if(results == true){
            req.session.is_admin = true
        }
        req.session.userId = req.user.id
        
        req.session.save(() => {
            return res.redirect(`admin/${req.session.userId}/edit`)
        })

        }catch(err){
            console.error(err)
        }
        
        
    },
    forgotForm(req,res){

        return res.render('user/forgot-password')
    },
    async forgot(req,res){


        try {

            const user = req.user
            const token = crypto.randomBytes(20).toString("hex")
           
            let now = new Date()
            now = now.setHours(now.getHours() + 1)
            
            await User.newUpdate(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
    
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de Senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p> <a href='localhost:5000/users/password-reset?token=${token}' target="_blank"> RECUPERAR SENHA</a>  </p>
                `
            })
    
            return res.render('user/forgot-password', {
                success: 'Sucesso! Verifique seu email'   
            })
    


        } catch(err){
            return res.render('user/forgot-password', {
                error: 'Erro inesperado. Tente novamente'
            })
        }


        
    },
    resetForm(req,res){
        return res.render('user/password-reset', {token: req.query.token})
    },
    async reset(req,res){
        const user = req.user
        const { password, token} = req.body 

        try {

        const newPassword = await hash(password, 8)
        await User.newUpdate(user.id, {
            password: newPassword,
            reset_token:'',
            reset_token_expires: ''

        })
        return res.render('user/login', {
            user: req.body,
            success: "Senha Atualizada! Faça o seu login"
        })

        } catch(err){
            console.error(err)
            return res.render('user/password-reset', {
                user: req.body,
                token,
                error: 'Erro inesperado. Tente novamente'
            })
        }
    }
}