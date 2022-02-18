import {
  dropSchema,
  createSchema,
  end,
  insertFromFile,
  listEvents,
} from './lib/db.js';

async function create() {
  await dropSchema();
  await createSchema();
  await insertFromFile();
  await end();
}

create().catch((err) => {
  console.error('Error creating running setup', err);
});
