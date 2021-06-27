import { InvalidParamError, MissingParamError } from '../errors';
import { EmailValidator, badRequest, serverError } from '../helpers';

import { HttpRequest, HttpResponse, Controller } from './../../types/http';

const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'));
      }
      return {
        statusCode: 200,
        body: 'sucesso'
      }
    } catch (error) {
      return serverError()
    }
  }
}
