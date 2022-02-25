import { Controller } from 'types/http';

import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter/email-validator-adapter';
import { DbAddAccount } from '../../data/db-add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { LogControllerDecorator } from '../decorators/log';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const logMongoRepository = new LogMongoRepository();
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount);

  return new LogControllerDecorator(signupController, logMongoRepository);
}
