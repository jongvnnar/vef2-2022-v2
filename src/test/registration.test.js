import { describe, expect, it } from '@jest/globals';
import { validationResult } from 'express-validator';
import {
  validationMiddleware,
  xssSanitizationMiddleware,
  sanitizationMiddleware,
} from '../routes/index-routes';

// Hjálparfall sem leyfir okkur að testa express-validator middleware
// https://stackoverflow.com/questions/28769200/unit-testing-validation-with-express-validator
async function applyAllMiddlewares(req, middlewares) {
  await Promise.all(
    middlewares.map(async (middleware) => {
      await middleware(req, {}, () => undefined);
    })
  );
}

// TODO breyta og laga test

describe('registration', () => {
  it('validates', async () => {
    const req = {
      body: {
        name: '',
      },
    };
    await applyAllMiddlewares(req, validationMiddleware);

    const validation = validationResult(req);

    expect(validation.isEmpty()).toBe(false);
  });

  it('sanitizes xss', async () => {
    const req = {
      body: {
        name: '<script>alert(1)</script>',
      },
    };

    await applyAllMiddlewares(req, xssSanitizationMiddleware);

    expect(req.body.name).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('trims', async () => {
    const req = {
      body: {
        name: '      name          ',
        comment: '            comment           ',
      },
    };

    await applyAllMiddlewares(req, sanitizationMiddleware);
    const expected = { name: 'name', comment: 'comment' };
    expect(req.body).toEqual(expected);
  });
});
