const swaggerAutogen = require('swagger-autogen')
const outputFile = './swagger-output.json'
const endpointsFiles = ['./todo.js']
const config = {
  info: {
    title: 'ToDo API',
    description: 'API for a ToDo App to remember tasks '
  },
  host: 'localhost:3000',
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      name: 'api-key',
      in: 'header'
    }
  },
  schemes: ['http'],
  definitions: {
    'server side error': {
      $status: 'ERROR',
      $msg: 'some error message',
      error: {
        $message: 'Error message caught',
        $name: 'Error name',
        stack: 'Error stack'
      }
    },
    tasks: {
      $id: 0,
      $createdDateTime: '2023-06-15T8:52:13.422',
      $finishedDateTime: null,
      $title: 'Create some random data',
      $description: 'Create some random data for the documentation',
      $creatorId: 0
    },
    account: {
      $id: 1,
      $email: 'john.doe@example.com',
      $password: 'm295'
    }
  }
}
swaggerAutogen(outputFile, endpointsFiles, config).then(async () => {
  await import('./todo.js') // Your express api project's root file where the server starts
})
