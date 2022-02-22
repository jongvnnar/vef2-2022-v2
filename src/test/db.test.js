import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import {
  createSchema,
  dropSchema,
  end,
  insertEvent,
  selectBySlug,
} from '../lib/db';

/**
 * Hér er test gagnagrunnur búinn til og hent áður en test eru keyrð.
 * package.json sér um að nota dotenv-cli til að loada .env.test sem vísar í þann gagnagrunn
 * sem ætti *ekki* að vera sá sami og við notum „almennt“
 */

describe('db', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
  });

  afterAll(async () => {
    await end();
  });

  it('creates a valid event, event exists', async () => {
    const success = await insertEvent({
      name: 'name',
      description: 'description',
      slug: 'slug',
    });
    expect(success).toBeTruthy();
    const result = await selectBySlug('slug');
    const { name, description, slug } = result[0];
    expect({ name, description, slug }).toEqual({
      name: 'name',
      description: 'description',
      slug: 'slug',
    });
  });
});
