import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { HttpRequest, HttpResponse, Controller } from './../../types/http';

const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return {
      statusCode: 200,
      body: 'test'
    };
  }
}
