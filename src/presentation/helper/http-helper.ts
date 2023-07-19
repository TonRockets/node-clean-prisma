import { ServerError } from '../errors/server-error'
import { type HttpResponse } from '../protocols/http'

// Making helpers to facilitate the returns
export const badRequest = (error: Error): HttpResponse => {
    return {
        body: error,
        statusCode: 400
    }
}

export const serverError = (error: any): HttpResponse => ({
    body: new ServerError(error.stack),
    statusCode: 500
})

export const ok = (data: any): HttpResponse => ({
    statusCode: 200,
    body: data
})
