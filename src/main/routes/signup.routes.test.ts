import request from 'supertest'
import app from '../config/app'

describe('Cotacao routes', () => {
    test('should integrate with cotacao routes and return rates success', async () => {
        app.post('/api/survey', (req, res, nect) => {
                res.send()
            })

        await request(app)
            .post(`/api/survey`)
            .send({
                name:"Wellington Pereira",
                email:"wellington@gmail.com",
                favoriteColor:"blue",
                cpf:"12332134560",
                note:"first payload for test"
            })
            .expect(200)
    })
})
