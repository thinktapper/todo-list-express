// add express framework
const express = require('express')
// give express a nicer name
const app = express()
// add mongoDB framework and assign MongoClient method to variable
const MongoClient = require('mongodb').MongoClient
// define a default port number
const PORT = 2121
// initiate environment variables
require('dotenv').config()

// declare database variable
let db,
    // assign database connection string from env file to variable
    dbConnectionStr = process.env.DB_STRING,
    // assign database name
    dbName = 'todo'
// Connect mongo client using connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // Promise handling that connection
    .then(client => {
        // Console log database is connected
        console.log(`Connected to ${dbName} Database`)
        // assign database variable to dbName database
        db = client.db(dbName)
    })
// Setting the view engine to EJS
app.set('view engine', 'ejs')
// Middleware
// Set static folder to public, making it always available to client
app.use(express.static('public'))
// Set option to parse url for data inside of request objects
app.use(express.urlencoded({ extended: true }))
// Set option to use json format for responses
app.use(express.json())

// Setting request handlers
// Set get handler for '/' route
app.get('/',async (request, response)=>{
    // finds all the database documents in the 'todos' collection and assigns them to arrays
    const todoItems = await db.collection('todos').find().toArray()
    // count all the database documents in the 'todos' collection that are not complete and assign value to variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // send data to ejs and render the html that goes back to the client
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
// Set post request handler on '/addTodo' for creating a todo
app.post('/addTodo', (request, response) => {
    // in the todos database collection, insert one document with the data in the request from the form in the html
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        // responds by telling the client to redirect to the homepage
        response.redirect('/')
    })
    .catch(error => console.error(error))
})
// Set put request handler for marking tasks as complete
app.put('/markComplete', (request, response) => {
    // in the todos database collection, update an item's completed status to true
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        // if no document is found, don't update
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // send response to client for the refresh
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
// Set put request handler for marking tasks as incomplete
app.put('/markUnComplete', (request, response) => {
    // in the todos database collection, update an item's completed status to false
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        // if no document is found, don't update
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        // send response to client for the refresh
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
// Set delete request handler
app.delete('/deleteItem', (request, response) => {
    // in the todos database collection, delete the item from the request body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        // send response to client for the refresh
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
// Set express server to listen for requests on the port environment variable or variable defined earlier
app.listen(process.env.PORT || PORT, ()=>{
    // log message to console saying which port server is running on
    console.log(`Server running on port ${PORT}`)
})