const swaggerAutogen = require('swagger-autogen')
const outputFile = './swagger-output.json'
const endpointsFiles = ['./bibliothek.js']
const config = {
  info: {
    title: 'D.Library API',
    description: 'API for a library with lends and books '
  },
  host: 'localhost:3004',
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
    book: {
      $name: 'Leos Biographie',
      $pages: 69,
      $rating: 4.20,
      $isbn: 8400
    },
    lends: {
      $id: 100,
      $customer_id: 123,
      $isbn: 402,
      $borrowed_at: '2023-06-14',
      $returned_at: null
    }
  }
}
swaggerAutogen(outputFile, endpointsFiles, config).then(async () => {
  await import('./bibliothek.js') // Your express api project's root file where the server starts
})
