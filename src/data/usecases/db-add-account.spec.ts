import type {
    Encrypter,
    AddAccountModel,
    AccountModel,
    AddAccountRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypterSut = (): Encrypter => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_cpf'))
        }
    }
    return new EncrypterStub()
}

const makeAddAccountRepositorySut = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccount())
        }
    }
    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    favoriteColor: 'any_color',
    cpf: 'any_cpf',
    note: 'any_note'
})

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@email.com',
    favoriteColor: 'any_color',
    cpf: 'any_cpf',
    note: 'any_note'
})

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterSut()
    const addAccountRepositoryStub = makeAddAccountRepositorySut()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.add(makeFakeAccountData())
        expect(encryptSpy).toHaveBeenCalledWith('any_cpf')
    })

    test('Should throw exception if Encrypter fail', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const addReturnPromise = sut.add(makeFakeAccountData())
        await expect(addReturnPromise).rejects.toThrow()
    })

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccount())
        expect(addSpy).toHaveBeenCalledWith({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@email.com',
            favoriteColor: 'any_color',
            cpf: 'hashed_cpf',
            note: 'any_note'
        })
    })

    test('Should throw exception if AddAccountRepository fail', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
            Promise.reject(new Error())
        )
        const addReturnPromise = sut.add(makeFakeAccountData())
        await expect(addReturnPromise).rejects.toThrow()
    })

    // No mock in succesfull case test
    test('Should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@email.com',
            favoriteColor: 'any_color',
            cpf: 'any_cpf',
            note: 'any_note'    
        })
    })
})
