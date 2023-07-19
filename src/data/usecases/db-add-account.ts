import type {
    AccountModel,
    AddAccount,
    AddAccountModel,
    AddAccountRepository,
    Encrypter
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter
    private readonly addAccountRepository: AddAccountRepository
    constructor(
        encrypter: Encrypter,
        addAccountRepository: AddAccountRepository
    ) {
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepository
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashedCPF = await this.encrypter.encrypt(
            accountData.cpf
        )
        const account = await this.addAccountRepository.add({
            ...accountData,
            cpf: hashedCPF
        })
        return account
    }
}
