import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-routes-adapter'
import { makeSignupController } from '../factories/add-survey'
import { makeLoadSurveysController } from 'main/factories/load-surves'

export default (router: Router): void => {
    router.post('/survey', adaptRoute(makeSignupController()))
    router.get('/surveys', adaptRoute(makeLoadSurveysController()))
}
