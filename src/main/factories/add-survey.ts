import { DbAddAccount } from 'data/usecases/db-add-account'
import { BcryptAdapter } from 'infra/criptography/bcrypt-adapter'
import { AccounPrismaRepository } from 'infra/db/Prisma/account-repository/account'
import { AddSurveyController } from 'presentation/controllers/add-survey/add-survey'
import { type Controller } from 'presentation/protocols'
import { EmailValidatorAdapter } from 'utils/email-validator-adapter'

export const makeSignupController = (): Controller => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const accounMongoRepository = new AccounPrismaRepository()
    const bcryptAdapterAdapter = new BcryptAdapter(12)
    const addAccount = new DbAddAccount(
        bcryptAdapterAdapter,
        accounMongoRepository
    )

    return new AddSurveyController(emailValidatorAdapter, addAccount)
}
