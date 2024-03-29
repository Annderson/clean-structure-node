import {
  AccountModel,
  AddAccount,
  AddAccountModel
} from 'domain/models/account';
import { Encrypter } from 'data/helpers/encrypter';
import { AddAccountRepository } from 'data/helpers/add-account-repository';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;

  constructor (
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    });
    return account;
  }
}
