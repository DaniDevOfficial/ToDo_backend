const express = require('express')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
const app = express()

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
const fs = require('fs')
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(expressSession({
  secret: 'thisisnotasecret',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

let tasks = []
let logins = []
fs.readFile('tasks.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }

  // eslint-disable-next-line no-undef
  tasks = JSON.parse(data).tasks
  logins = JSON.parse(data).logins
})
app.post('/login', (req, resp) => {
  /*
 #swagger.tags = ["login"]
 #swagger.summary = 'Login with email and password'
 #swagger.description = 'Login with email and password. If the email doesnt have a account one will be made with the password m295'
 #swagger.responses[200] = {description: "Logged in sucessfully", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[404] = {description: "json not found // no tasks available"}
*/
  const email = req.body.email
  const password = req.body.password
  const emailExistance = logins.some(login => Object.keys(login) && login.email === email) // chatgpt generated
  if (password !== 'm295') {
    return resp.send('password incorrect (it has to be m295)').status(401)
  }
  if (!emailExistance) {
    // if email is not in the json it will create a account
    let id = 1
    while (logins.map(logins => logins.id).includes(id)) {
      id++
    }
    const newLoggin = {
      id,
      email,
      password: 'm295'
    }
    logins.push(newLoggin)
  }

  req.session.email = email
  resp.send('You are now logged in. Happy hacking').status(201)
})

app.get('/verify', (req, resp) => {
  /*
 #swagger.tags = ["login"]
 #swagger.summary = 'Verify session token'
 #swagger.description = 'Verifies the session token given during the login part'
 #swagger.responses[200] = {description: "Verification sucessful"}}
 #swagger.responses[401] = {description: "Verification failed"}
*/
  if (!req.session.email) {
    return resp.send('failed').status(401)
  }
  resp.status(200).send('verified')
})



// temp
// temp
app.get('/tasks', (req, resp) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Get all tasks'
 #swagger.description = 'Get all tasks from the json file and displays them'
 #swagger.responses[200] = {description: "Json displayed", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[404] = {description: "json not found // no tasks available"}
*/
  if (!tasks) return resp.sendStatus(404)
  const allTasks = tasks.map((tasks) => tasks)
  resp.json(allTasks).status(200)
})

app.post('/tasks', (req, resp) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Post a new tasks'
 #swagger.description = 'Post a new tasks as a json object'
 #swagger.responses[201] = {description: "Task posted", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[400] = {description: "some values are null"}
*/
  let id = 5
  while (tasks.map(task => task.id).includes(id)) {
    id++
  }
  const createdDateTime = new Date().toISOString().split('Z')[0]
  const finishedDateTime = null
  const title = req.body.title ?? req.query.title
  const description = req.body.description ?? req.query.description
  const creatorId = 0

  const newTask = {
    id,
    createdDateTime,
    finishedDateTime,
    title,
    description,
    creatorId
  }
  tasks.push(newTask)
  resp.send(newTask).status(201)
})

app.get('/tasks/:id', (req, resp) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Get a specific task'
 #swagger.description = 'Get a specific task by its id'
 #swagger.responses[201] = {description: "Task found", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[404] = {description: "id does not exist"}
*/
  const id = parseInt(req.params.id)
  const specificTask = tasks.find(tasks => tasks.id === id)
  if (!specificTask) return resp.sendStatus(404)
  resp.json(specificTask)
})

app.put('/tasks/:id', (req, resp) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Put a specific task'
 #swagger.description = 'Put a specific task by its id'
 #swagger.responses[200] = {description: "Task updated", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[404] = {description: "id does not exist"}
*/
  let id = parseInt(req.params.id)
  const taskIndex = tasks.findIndex((tasks) => tasks.id === id)
  const specificTask = tasks.find(tasks => tasks.id === id)
  if (!specificTask) return resp.sendStatus(404)

  const updatedTask = {
    id: req.body.id,
    createdDateTime: req.body.createdDateTime,
    finishedDateTime: req.body.finishedDateTime,
    title: req.body.title,
    description: req.body.description,
    creatorId: req.body.creatorId
  }
  while (tasks.map(task => task.id).includes(id)) {
    id++
  }
  tasks.splice(taskIndex, 1, updatedTask)
  resp.json(updatedTask).sendStatus(200)
})

app.delete('/tasks/:id', (req, resp) => {
  /*
 #swagger.tags = ["tasks"]
 #swagger.summary = 'Delete a specific task'
 #swagger.description = 'Delete a specific task by its id'
 #swagger.responses[204] = {description: "Task Deleted", schema:{$ref: "#/definitions/tasks"}}
 #swagger.responses[404] = {description: "id does not exist"}
*/
  const id = parseInt(req.params.id)
  const taskIndex = tasks.findIndex((tasks) => tasks.id === id)
  const specificTask = tasks.find(tasks => tasks.id === id)
  if (!specificTask) return resp.sendStatus(404)

  tasks.splice(taskIndex, 1)
  resp.sendStatus(204)
})

app.use((req, resp) => {
  resp.sendStatus(404)
})
app.listen(port, () => {
  console.log(`Is running on port ${port}`)
})
