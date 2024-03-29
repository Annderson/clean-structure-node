import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator return false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@mail.com');
    expect(isValid).toBe(false);
  });

  test('Should return true if validator return true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@mail.com');
    expect(isValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpyOn = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@mail.com');
    expect(isEmailSpyOn).toHaveBeenCalledWith('any_email@mail.com');
  });
});
