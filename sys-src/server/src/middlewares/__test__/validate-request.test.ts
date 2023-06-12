import request from 'supertest'
import { app } from '../../app'

jest.mock("../../models/user", ()=>({
  create: jest.fn(()=>{return {}})
}))
describe('validateRequest', () => {
  beforeAll(()=>      {
    process.env.JWT_KEY="secret"
  })
  // Let's assume there's a POST route in your application that uses the validateRequest middleware
  it('should throw a RequestValidationError if validation fails', async () => {
    const response = await request(app).post('/api/auth/signin').send({}) // Let's assume the route expects some data, and we're sending an empty object

    expect(response.status).toBe(400) // Assuming your RequestValidationError sets the status code to 400
    expect(response.body.errors).toBeDefined() // Assuming your error format includes an 'errors' property
  })

  it('should not throw a RequestValidationError if validation is successful', async () => {
    const response = await request(app).post('/api/auth/signup').send({
    password: 'passworD1!', username: '2'
  }) // Replace with valid data for your route

    expect(response.status).not.toBe(400)
    expect(response.body.errors).toBeUndefined()
  })
})
