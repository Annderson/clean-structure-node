import { AccountModel } from 'domain/models/account/account';

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}
export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>;
}
