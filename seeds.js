const faker = require('faker')

const { date } = require('./src/app/lib/utils')
const {hash} = require('bcryptjs')

const User = require('./src/app/models/user')
const Chef = require('./src/app/models/chef')
const File = require('./src/app/models/file')
const Recipe = require('./src/app/models/recipe')



let filesIds = []
let recipesIds = []
let chefsIds = []
let usersIds = []
let totalUsers = 3
let totalChefs = 3
let totalRecipes = 4

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
            name: faker.name.firstName(),
            path: faker.image.avatar(),
            
        })
        
    }

    const filesPromise = files.map(file => File.create(file))

    filesIds = await Promise.all(filesPromise)
    
    let chefs = []
    
    
    for(let i = 0; i < totalChefs; i++){
        
        

        

        chefs.push({
            
            name: faker.name.firstName(),
            file_id: filesIds[i].rows[0].id,
            created_at: date(Date.now()).iso
            
        })
        
       


    }

    
    const chefsPromise = chefs.map(chef => Chef.create(chef))
    chefsIds = await Promise.all(chefsPromise)
    


}



// criar recipes

async function createRecipes(){

    let recipes = []
    let files = []
    let recipe_files = []
    // insert files
    while(files.length < totalRecipes){

        files.push({
            name: faker.random.word(),
            path: faker.image.food(),
            
        })
        
    }

    const filesPromise = files.map(file => File.create(file))

    filesIds = await Promise.all(filesPromise)
    
    // insert recipes
    while(recipes.length < totalRecipes){

        
        recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)].rows[0].id,
            title: faker.name.title(),
            ingredients: `{${faker.lorem.word(Math.ceil(Math.random() * 10))}}`,
            preparation: `{${faker.lorem.paragraph(Math.ceil(Math.random() * 10))}}`,
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)].rows[0].id,
            created_at: date(Date.now()).iso
            
           


        })


    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    recipesIds = await Promise.all(recipesPromise)

    // insert recipe_files
    
    for(let i = 0; i < recipesIds.length; i++){
        
        


        recipe_files.push({
            recipe_id: recipesIds[i].rows[0].id, 
            file_id: filesIds[Math.floor(Math.random() * filesIds.length)].rows[0].id
        })
    }
    
    const recipe_filesPromise = recipe_files.map(recipe_file => File.join(recipe_file))
    await Promise.all(recipe_filesPromise)


}









// executar seeds

async function init(){


    await createUsers()
    await createChefs()
    await createRecipes()




}

init()