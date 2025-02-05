import dotenv from 'dotenv';
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { isInvalid } from './lib/template-helpers.js';
import { indexRouter } from './routes/index-routes.js';
import passport from './lib/login.js';
import { adminRouter } from './routes/admin-routes.js';

dotenv.config();

const { PORT: port = 3000, SESSION_SECRET: sessionSecret } = process.env;

const app = express();

// Sér um að req.body innihaldi gögn úr formi
app.use(express.urlencoded({ extended: true }));

const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, '../public')));
app.set('views', join(path, '../views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    maxAge: 20 * 1000, // 20 sek
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.locals = {
  // TODO hjálparföll fyrir template
  isInvalid,
};

app.use('/admin', adminRouter);
app.use('/', indexRouter);

/** Middleware sem sér um 404 villur. */
app.use((req, res) => {
  const title = 'Síða fannst ekki';
  res
    .status(404)
    .render('error', { title, text: 'Villa 404, síða fannst ekki' });
});

/** Middleware sem sér um villumeðhöndlun. */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const title = 'Villa kom upp';
  const text = err.message;
  res.status(500).render('error', { title, text });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
