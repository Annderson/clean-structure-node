import { Controller, HttpRequest, HttpResponse } from 'types/http';
import { serverError, success } from '../../presentation/helpers';
import { LogErrorRepository } from 'data/helpers/log-error-repository';
import { LogControllerDecorator } from './log';
import { AccountModel } from 'domain/models/account';

interface SutTypes {
  sut: LogControllerDecorator;
  controllerSub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositorySub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await new Promise(resolve => resolve());
    }
  }
  return new LogErrorRepositorySub();
}

const makeController = (): Controller => {
  class ControllerSub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => resolve(success(makeFakeAccount())));
    }
  }
  return new ControllerSub();
}

const makeSut = (): SutTypes => {
  const controllerSub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepositoryStub();
  const sut = new LogControllerDecorator(controllerSub, logErrorRepositoryStub);
  return {
    sut,
    controllerSub,
    logErrorRepositoryStub
  };
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerSub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerSub, 'handle');
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(success(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller a server error', async () => {
    const { sut, controllerSub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest.spyOn(controllerSub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeServerError())))
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
