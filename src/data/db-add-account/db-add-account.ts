import {
  AccountModel,
  AddAccount,
  AddAccountModel
} from 'domain/models/account';
import { Encrypter } from 'data/protocols/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return await new Promise((resolve) =>
      resolve({ id: '11', name: 'a', password: 'a', email: 'e@mail.com' })
    );
  }
}
