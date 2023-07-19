import type { AddAccountRepository } from 'data/protocols/add-account-repository'
import type { AccountModel } from 'domain/models/account-model'
import type { AddAccountModel } from 'domain/usecases/add-account'
import { prismaClient } from '../prismaClient'

export class AccounPrismaRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const result = await prismaClient.user.create({
            data: {
                
                ...accountData
            }
        })
        return result
    }
}