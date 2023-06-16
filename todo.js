const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
const app = express()

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const fs = require('fs')

const port = 3000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let tasks
fs.readFile('tasks.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }

  // eslint-disable-next-line no-undef
  tasks = JSON.parse(data).tasks
})

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


app.listen(port, () => {
  console.log(`Is running on port ${port}`)
})
