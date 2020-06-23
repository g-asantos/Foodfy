const User = require('../models/user')
const db = require('../config/db')
const {hash} = require('bcryptjs')


module.exports = {

	async index(req, res) {

		try{
			const userEmail = await db.query('SELECT users.email FROM users WHERE reset_token = $1', [req.query.token])


			const user = await User.findOne({ email: userEmail.rows[0].email })

			if (!user) return res.render('admin/profile', {
				error: 'Usuário não encontrado'
			})



			return res.render('admin/profile', { user })

		}catch(err){
			console.error(err)
		}
        
        
	},
	async put(req, res) {

		const { password} = req.body
        
        

		try {

            
            

			const user = req.user

			const newPassword = await hash(password, 8)
			await User.newUpdate(req.body.id , {
				password: newPassword,
				reset_token: '',
				reset_token_expires: ''

			})
			return res.render('user/login', {
				user: req.body,
				success: 'Senha Atualizada! Faça o seu login'
			})

		} catch (err) {
			let results = await db.query('SELECT users.reset_token FROM users WHERE id = $1', [req.body.id])
			let token = results.rows[0].reset_token
			console.error(err)
			return res.render('user/password-reset', {
				user: req.body,
				token, 
				error: 'Erro inesperado. Tente novamente'
			})
		}



	}

}
