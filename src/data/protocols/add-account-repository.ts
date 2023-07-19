import type {
    AddAccountModel,
    AccountModel
} from '../usecases/db-add-account-protocols'

export interface AddAccountRepository {
    add(accountData: AddAccountModel): Promise<AccountModel>
}
