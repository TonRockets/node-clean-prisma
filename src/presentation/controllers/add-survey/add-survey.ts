import type {
    EmailValidator,
    Controller,
    HttpRequest,
    HttpResponse,
    AddAccount
} from '../survey-protocols'

import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from 'presentation/helper/http-helper'

export class AddSurveyController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const {
                name,
                email,
                cpf,
                favoriteColor,
                note
            } = httpRequest.body
            
            const requiredFields = [
                'name',
                'email',
                'favoriteColor',
                'cpf',
                'note'
            ]
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }


            const isValidEmail = this.emailValidator.isValid(email)
            if (!isValidEmail) {
                return badRequest(new InvalidParamError('email'))
            }
            const account = await this.addAccount.add({
                name,
                email,
                cpf,
                favoriteColor,
                note
            })
            return ok(account)
        } catch (error) {
            console.error(error)
            return serverError(error)
        }
    }
}
