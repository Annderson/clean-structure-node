import { HttpRequest, HttpResponse, Controller } from 'types/http';
import { AddAccount } from 'domain/models/account';

import { EmailValidator, badRequest, serverError, success } from '../helpers';
import { InvalidParamError, MissingParamError } from '../errors';

const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return success(account);
    } catch (error) {
      return serverError()
    }
  }
}
