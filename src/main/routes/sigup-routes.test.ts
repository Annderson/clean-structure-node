import request from 'supertest';

import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helpers';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return an account on success ', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Anderson',
        email: 'anderson@gamil.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
