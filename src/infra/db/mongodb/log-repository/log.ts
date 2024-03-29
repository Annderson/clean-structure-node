import { MongoHelper } from '../helpers/mongo-helpers';
import { LogErrorRepository } from '../../../../data/helpers/log-error-repository';

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
