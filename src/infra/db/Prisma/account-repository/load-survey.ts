import type { SurveyModel } from 'domain/models/survey-model'
import { prismaClient } from '../prismaClient'
import { LoadSurveyRepository } from 'data/protocols/load-survey-repository'

export class SurveyPrismaRepository implements LoadSurveyRepository {
    async load(): Promise<SurveyModel[]> {
        const result = await prismaClient.user.findMany()
        return result.map(item => (
            {
                name: item.name,
                email: item.email,
                favoriteColor: item.favoriteColor,
                note: item.note
            }
        ))
    }
}