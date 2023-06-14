import request from 'supertest'
import { app } from '../../app'

jest.mock("../../models/user", ()=>({
  create: jest.fn(()=>{return {}})
}))

describe('validateRequest', () => {
  beforeAll(()=>      {
    process.env.JWT_KEY="secret"
  })

  it('should not throw a RequestValidationError if validation is successful', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      password: 'passworD1!', username: '2'
    })

    expect(response.status).not.toBe(400)
    expect(response.body.errors).toBeUndefined()
  })

  it('should throw a RequestValidationError if validation fails', async () => {
    const response = await request(app).post('/api/auth/signin').send({})

    expect(response.status).toBe(400)
    expect(response.body.errors).toBeDefined()
  })


})
