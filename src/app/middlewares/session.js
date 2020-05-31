const db = require('../config/db')

async function onlyAdmins(req, res, next) {
    
    let admin_data = await db.query('SELECT users.is_admin FROM users WHERE users.id = $1', [req.session.userId])
    
    if(admin_data.rows[0].is_admin == false){
        return res.render('user/login', {
        error: 'Você não esta autorizado a realizar esta ação'


        })
    }
    

    next()
}



async function isLogged(req, res, next) {

    if (!req.session.userId) {

        return res.redirect('/users/login')
    }

    
    next()

}

async function isAdmin(req, res, next) {
    let admin_data = await db.query('SELECT users.is_admin FROM users WHERE users.id = $1', [req.session.userId])
    
    if(admin_data.rows[0].is_admin == false){
        return res.redirect('/users/admin/recipes')
    }
    next()

}

async function deleteSelf(req, res, next) {
    
    
    
    if (req.session.userId == req.params.id) {
        return res.render('user/login', {
            error: 'Você não pode deletar sua propria conta'
    
    
            })
        
        
    }

    next()
}


async function isCreator(req, res, next) {
    const results = await db.query('SELECT * FROM users WHERE id = $1', [req.session.userId])

    if ((req.session.userId != req.session.recipeCreator) && (results.rows[0].is_admin == false)) {

        return res.render(`user/login`, {

            error: 'Você não esta autorizado a esta ação'
        })


    }
    next()
}
module.exports = {
    onlyAdmins,
    isLogged,
    deleteSelf,
    isCreator,
    isAdmin
}