import { AddAccountRepository } from 'data/helpers/add-account-repository';
import { AddAccountModel, AccountModel } from 'domain/models/account';
import { MongoHelper } from '../helpers/mongo-helpers';

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: result.insertedId });
    return MongoHelper.map(account);
  }
}
