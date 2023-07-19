import type { AccountModel } from 'domain/models/account-model'

export interface AddAccountModel {
    name: string
    cpf: string
    email: string
    favoriteColor: string
    note: string
}

export interface AddAccount {
    add(account: AddAccountModel): Promise<AccountModel>
}
