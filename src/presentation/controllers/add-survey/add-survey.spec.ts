import type {
    AccountModel,
    AddAccount,
    AddAccountModel,
    EmailValidator,
    HttpRequest
} from '../survey-protocols'
import { AddSurveyController } from './add-survey'
import {
    MissingParamError,
    InvalidParamError,
    ServerError
} from '../../errors'
import { ok, badRequest, serverError } from 'presentation/helper/http-helper'

// a Factory Pattern
const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccout())
        }
    }

    return new AddAccountStub()
}

const makeFakeAccout = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    favoriteColor: 'any_color',
    cpf: 'any_cpf',
    note: 'any_note'
})

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        favoriteColor: 'any_color',
        cpf: 'any_cpf',
        note: 'any_note'
    }
})

interface SutTypes {
    sut: AddSurveyController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}

// a Factory pattern
const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new AddSurveyController(emailValidatorStub, addAccountStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
                favoriteColor: 'any_color',
                cpf: 'any_cpf',
                note: 'any_note'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
        /* When we compare object we need to use 'toEqual' instead toBe,
    because toBe compare type and value of an object, the toEqual just
    compare a value.
    */
    })

    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
                favoriteColor: 'any_color',
                cpf: 'any_cpf',
                note: 'any_note'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
        /* When we compare object we need to use 'toEqual' instead toBe,
    because toBe compare type and value of an object, the toEqual just
    compare a value.
    */
    })

test('Should return 400 if no favorite color is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
                cpf: 'any_cpf',
                note: 'any_note'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('favoriteColor'))
        )
    })

    test('Should return 400 if an invalid email is no provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
        /* When we compare object we need to use 'toEqual' instead toBe,
    because toBe compare type and value of an object, the toEqual just
    compare a value.
    */
    })

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('Should return 500 if EmailValidator throws exception', async () => {
        const { sut, emailValidatorStub } = makeSut()

        // This conde implements a new Error, without need to create a new emailValidator's instance
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
        /* When we compare object we need to use 'toEqual' instead toBe,
    because toBe compare type and value of an object, the toEqual just
    compare a value.
    */
    })

    test('Should calls AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        await sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@email.com',
            favoriteColor: 'any_color',
            cpf: 'any_cpf',
            note: 'any_note'
        })
    })

    test('Should return 500 if AddAccount throws exception', async () => {
        const { sut, addAccountStub } = makeSut()

        // This conde implements a new Error, without need to create a new emailValidator's instance
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
        /* When we compare object we need to use 'toEqual' instead toBe,
    because toBe compare type and value of an object, the toEqual just
    compare a value.
    */
    })

    test('Should return 200 if data is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccout()))
        /* When we compare objects we need to use 'toEqual' instead toBe,
    because toBe compare type and value of an object, the toEqual just
    compare a value.
    */
    })
})
