import type {
    SurveyModel
} from 'domain/models/survey-model'

export interface LoadSurveyRepository {
    load(): Promise<SurveyModel[]>
}
