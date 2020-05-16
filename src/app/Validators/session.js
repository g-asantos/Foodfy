const User = require('../models/user')
const db = require('../config/db')
const { date } = require('../lib/utils')
const { compare } = require('bcryptjs')




async function login(req, res, next) {



    const { email, password } = req.body

    const user = await User.findOne({ email })



    if (!user) return res.render('user/login', {
        user: req.body,
        error: 'Usuário não cadastrado!'
    })


    const passed = await compare(password, user.password)
    if ((password != user.password) && (!passed)) return res.render('user/login', {
        user: req.body,
        error: "Senha Incorreta"
    })




    req.user = user

    next()
}

async function forgot(req, res, next) {

    const { email } = req.body

    try {

        let user = await User.findOne({ email })
        if (!user) return res.render('user/forgot-password', {
            user: req.body,
            error: 'Email não cadastrado!'
        })
        req.user = user
        next()
    } catch (err) {
        console.error(err)
    }




}


async function reset(req, res, next) {

    const { email, password, passwordRepeat, token } = req.body


    const user = await User.findOne({ email })



    if (!user) return res.render('user/password-reset', {
        user: req.body,
        token,
        error: 'Usuário não cadastrado!'
    })


    if(password != passwordRepeat) return res.render('user/password-reset', {
        user: req.body,
        token,
        error: 'A senha e sua repetição não batem'
    })

    if(token != user.reset_token) return res.render('user/password-reset', {
        user: req.body,
        token,
        error: 'Token Invalido.'
    })

    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires) return res.render('user/password-reset', {
        user: req.body,
        token,
        error: 'Token expirado.'
    })

    req.user = user

    next()

}


async function edit(req,res,next){
    
    const results = await db.query('SELECT * FROM users WHERE id = $1', [req.session.userId])
    
    if(req.session.userId != req.params.id && results.rows[0].is_admin != true  ){
        
        return res.render(`user/login`,{

            error: 'Você não esta autorizado a editar esse usuário'
        })
    }    
    next()
}

async function editPut(req,res,next){
    

    const results = await db.query('SELECT * FROM users WHERE id = $1', [req.session.userId])

    if(req.body.id != req.session.userId && results.rows[0].is_admin != true  ){
        return res.render('user/login', {
            user: req.body,
            error: 'Você não tem autorização para editar este usuário.'
    }) 

    }
    next()
}
    



module.exports = {
    login,
    forgot,
    reset,
    edit,
    editPut
}