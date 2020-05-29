const faker = require('faker')


const {hash} = require('bcryptjs')

const User = require('./src/app/models/user')
const Chef = require('./src/app/models/chef')
const File = require('./src/app/models/file')
const Recipe = require('./src/app/models/recipe')


let usersIds = []
let totalUsers = 3
let totalChefs = 10


//criar user
async function createUsers(){
    const users = []
    const password = await hash('1111', 8)



    while(users.length < totalUsers){



        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: faker.random.boolean()
        })
    }

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)



}

// criar chefs
async function createChefs(){

    let files = []

    while(files.length < totalChefs){

        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
            
        })
        
    }

    const filesPromise = files.map(file => File.create(file))

    const filesIds = await Promise.all(filesPromise)

    let chefs = []

    while(chefs.length < totalChefs){


        chefs.push({
            
            name: faker.name.firstName(),
            file_id: filesIds[Math.floor(Math.random() * totalChefs)]
            
        })


    }


    const chefsPromise = chefs.map(chef => Chef.create(chef))
    await Promise.all(chefsPromise)



}




// criar recipes

async function createRecipes(){

    let products = []

    while(products.length < totalProducts){


        products.push({
            category_id: Math.ceil(Math.random() * 3),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            name: faker.name.title(),
            description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            old_price: faker.random.number(99999),
            price: faker.random.number(99999),
            quantity: faker.random.number(99),
            status: Math.round(Math.random())




        })


    }


    const productsPromise = products.map(product => Product.create(product))
    productsIds = await Promise.all(productsPromise)

    let files = []

    while(files.length < 1){

        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
            product_id: productsIds[Math.floor(Math.random() * totalProducts)]
        })
        
    }

    const filesPromise = files.map(file => File.create(file))

    await Promise.all(filesPromise)


}









// executar seeds

async function init(){


    await createUsers()
    await createProducts()





}

init()