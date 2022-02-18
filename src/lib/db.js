import { readFile } from 'fs/promises';
import pg from 'pg';

const SCHEMA_FILE = './sql/schema.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';
const INSERT_FILE = './sql/insert.sql';

const { DATABASE_URL: connectionString, NODE_ENV: nodeEnv = 'development' } =
  process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development
// mode, á heroku, ekki á local vél
const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

export async function query(q, values = []) {
  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    if (nodeEnv !== 'test') {
      console.error('unable to query', e);
    }
    return null;
  } finally {
    client.release();
  }
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}

export async function end() {
  await pool.end();
}

/* TODO útfæra aðgeðir á móti gagnagrunni */
export async function insertFromFile(insertFile = INSERT_FILE) {
  const data = await readFile(insertFile);

  return query(data.toString('utf-8'));
}

export async function listEvents() {
  let result = [];

  try {
    const q = `
      SELECT
        id, name, slug, description, created, updated
      FROM
        events
    `;

    const queryResult = await query(q);

    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting events', e);
  }

  return result;
}

export async function selectBySlug(slug) {
  const q = `
  SELECT
    id, name, slug, description, created, updated
  FROM
    events
  WHERE
   slug = $1::text
  `;
  let result = [];
  try {
    const queryResult = await query(q, [slug]);
    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting events', e);
  }

  return result;
}

export async function selectEventBookings(id) {
  const q = `
  SELECT
    name, comment, created
  FROM
    bookings
  WHERE
   event = $1::integer
  `;
  let result = [];
  try {
    const queryResult = await query(q, [id]);
    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting bookings for event', e);
  }
  return result;
}

export async function insertBooking({ name, comment, id } = {}) {
  let success = true;

  const q = `
    INSERT INTO bookings
      (name, comment, event)
    VALUES
      ($1, $2, $3);
  `;
  const values = [name, comment, id];

  try {
    await query(q, values);
  } catch (e) {
    console.error('Error inserting booking', e);
    success = false;
  }

  return success;
}

export async function selectEventByName(name) {
  const q = `
  SELECT
    id
  FROM
    events
  WHERE
   name = $1::text
  `;
  let result = [];
  try {
    const queryResult = await query(q, [name]);
    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting events', e);
  }

  return result;
}

export async function insertEvent({ name, description, slug } = {}) {
  let success = true;
  const q = `
    INSERT INTO events
      (name, description, slug)
    VALUES
      ($1, $2, $3);
  `;
  const values = [name, description, slug];

  try {
    await query(q, values);
  } catch (e) {
    console.error('Error inserting event', e);
    success = false;
  }

  return success;
}

export async function updateEvent({ name, description, slug, id } = {}) {
  const currentTime = new Date();
  const q = `
    UPDATE events
      SET (name, description, slug, updated) =
      ($1, $2, $3, $4)
      WHERE id = $5;
  `;
  const values = [name, description, slug, currentTime, id];
  let success = true;
  try {
    await query(q, values);
  } catch (e) {
    console.error('Error inserting event', e);
    success = false;
  }
  return success;
}
