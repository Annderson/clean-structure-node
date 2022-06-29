import { Controller, HttpRequest, HttpResponse } from '../../../types/http';
import { badRequest, serverError, EmailValidator, success, unauthorized } from '../../helpers';
import { MissingParamError, InvalidParamError } from '../../errors';
import { Authentication } from '../../../domain/models/authentication';

const requiredFields = ['email', 'password'];

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, password } = httpRequest.body;

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }

      return success({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
