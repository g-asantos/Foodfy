const User = require('../models/user')
const db = require('../config/db')
const { date } = require('../lib/utils')


function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == '') {
            return {
                user: body,
                error: 'Preencha todos os campos!'
            }
        }
    }
}




async function post(req, res, next) {

    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) {
        return res.render('user/register', fillAllFields)
    }

    const { email } = req.body
    const user = await User.findOne({ email })



    if (user) return res.render('user/register', {
        error: 'Usuário já cadastrado!'
    })



    next()
}




module.exports = {
    post

}