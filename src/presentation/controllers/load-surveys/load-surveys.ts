import { Controller, HttpRequest, HttpResponse } from "../survey-protocols";
import { ok } from "presentation/helper/http-helper";
import { LoadSurveyRepository } from "data/protocols/load-survey-repository";

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveyRepository) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        
        const result = await this.loadSurveys.load()
        return ok(result)
    };
}
