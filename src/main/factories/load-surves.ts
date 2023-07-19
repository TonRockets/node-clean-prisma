import { SurveyPrismaRepository } from 'infra/db/Prisma/account-repository/load-survey'
import { LoadSurveysController } from 'presentation/controllers/load-surveys/load-surveys'
import { type Controller } from 'presentation/protocols'


export const makeLoadSurveysController = (): Controller => {
    const surveysPrismaRepository = new SurveyPrismaRepository()

    return new LoadSurveysController(surveysPrismaRepository)
}
