import { Router } from 'express';
import { makeSignUpController } from '../factories/signup';
import { adaptRoute } from '../adapters/route-adapter';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
}
