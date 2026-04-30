import task from './task.wagger.js'

const swaggerDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Backend TodoX',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:6969',
      description: 'Server tại local'
    }
  ],
  components: {
    securitySchemes: {
      minhTienToken: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    ...task
  }
}

export default swaggerDocument