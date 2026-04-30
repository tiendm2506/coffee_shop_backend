const task = {
  '/api/tasks/list': {
    get: {
      tags: ['Tasks'],
      security: [{ minhTienToken: [] }],
      parameters: [],
      responses: {
        200: {
          description: 'OK'
        }
      }
    }
  },
  '/api/tasks/create': {
    post: {
      tags: ['Tasks'],
      security: [{ minhTienToken: [] }],
      responses: {
        200: {
          description: 'oke'
        }
      },
      requestBody: {
        description: 'Data to create a task',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },
  '/api/tasks/update/{id}': {
    put: {
      tags: ['Tasks'],
      security: [{ minhTienToken: [] }],
      responses: {
        200: {
          description: 'oke'
        }
      },
      parameters:[
        {
          name: 'id',
          in: 'path',
          description: 'Task ID',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      requestBody: {
        description: 'Data to update a task',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                status: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}

export default task