import { AccountModel, AddAccountModel } from 'domain/models/account';

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
