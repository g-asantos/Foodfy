# Foodfy

Foodfy is an recipe website where you can create your own recipes. 
Developed during the LaunchBase bootcamp by RocketSeat.



### Features

* Recipes CRUD
* Chefs CRUD
* Users CRUD
* Login
* File Upload



### Installation


Clone the project with:

```sh
git clone https://github.com/g-asantos/Foodfy.git
```

Get in the project's path, then install the dependencies with:

```sh
npm install
```

Then, you have to create your own postgres database (Use foodfy.sql).


If you'd like to have some pre-created users/recipes/chefs:

```sh
node seeds.js
```

After database config, you can start the server with:

```sh
npm start
```


### Try it using Mailtrap

Mailtrap is a Fake SMTP server for email testing from the development & staging environments without spamming your real users.

Create an account and an inbox, then in the SMTP Settings - Integrations, select Nodemailer and copy the content into the mailer.js located in the lib folder.



## Built with

- HTML
- CSS
- Javascript
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Connect PG Simple](https://www.npmjs.com/package/connect-pg-simple)
- [Method-Override](https://www.npmjs.com/package/method-override)
- [Nodemailer](https://nodemailer.com/)
- [Postgres](https://www.postgresql.org/)
- [Bcrypt](https://www.npmjs.com/package/bcryptjs/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Multer](https://github.com/expressjs/multer/)
- [Nodemon](https://nodemon.io/)



## Author

  **Guilherme Azevedo dos Santos**

* Github: [@g-asantos](https://github.com/g-asantos)
* Linkedin: [@guilherme-azevedo-dos-santos-417a70159](https://www.linkedin.com/in/guilherme-azevedo-dos-santos-417a70159/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
