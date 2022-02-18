import express from 'express';
import xss from 'xss';

import passport, { ensureLoggedIn } from '../lib/login.js';
import { catchErrors } from '../lib/catch-errors.js';
import {
  listEvents,
  selectBySlug,
  updateEvent,
  insertEvent,
} from '../lib/db.js';
import { body, validationResult } from 'express-validator';
import { createSlug } from '../lib/create-slug.js';

export const adminRouter = express.Router();

async function index(req, res) {
  const { user } = req;
  const events = await listEvents();
  const errors = [];
  const formData = {
    name: '',
    description: '',
  };
  res.render('admin', {
    title: 'Viðburðaumsjón',
    subtitle: 'Viðburðir',
    events,
    username: user.username,
    errors,
    formData,
  });
}

function login(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/admin');
  }

  let message = '';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
  // og hreinsum skilaboð
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('login', { message, title: 'Innskráning' });
}

adminRouter.get('/', ensureLoggedIn, catchErrors(index));
adminRouter.get('/login', login);

adminRouter.post(
  '/login',

  // Þetta notar strat að ofan til að skrá notanda inn
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/admin/login',
  }),

  // Ef við komumst hingað var notandi skráður inn, senda á /admin
  (req, res) => {
    res.redirect('/admin');
  }
);

adminRouter.get('/logout', (req, res) => {
  // logout hendir session cookie og session
  req.logout();
  res.redirect('/');
});

const validationMiddleware = [
  body('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  body('name')
    .isLength({ max: 64 })
    .withMessage('Nafn má að hámarki vera 64 stafir'),
  body('description')
    .isLength({ max: 400 })
    .withMessage('Athugasemd má að hámarki vera 400 stafir'),
];

const xssSanitizationMiddleware = [
  body('name').customSanitizer((v) => xss(v)),
  body('description').customSanitizer((v) => xss(v)),
];

const sanitizationMiddleware = [
  body('name').trim().escape(),
  body('description').trim().escape(),
];

async function validationCheck(req, res, next) {
  const { name, description } = req.body;
  const { user } = req;
  const formData = {
    name,
    description,
  };
  const validation = validationResult(req);
  const events = await listEvents();

  if (!validation.isEmpty()) {
    return res.render('admin', {
      title: 'Viðburðaumsjón',
      subtitle: 'Viðburðir',
      events,
      username: user.username,
      errors: validation.errors,
      formData,
    });
  }

  return next();
}

async function addEvent(req, res) {
  const { name, description } = req.body;

  let success = true;
  let event = {
    name,
    description,
    slug: await createSlug(name),
  };

  try {
    success = await insertEvent(event);
  } catch (e) {
    console.error(e);
  }

  if (success) {
    return res.redirect(`/admin`);
  }

  return res.render('error', {
    title: 'Gat ekki stofnað viðburð!',
    text: 'Skráning gekk ekki eftir :/',
  });
}

adminRouter.post(
  '/',
  validationMiddleware,
  xssSanitizationMiddleware,
  catchErrors(validationCheck),
  sanitizationMiddleware,
  catchErrors(addEvent)
);

async function eventRoute(req, res, next) {
  let event = {};
  const { user } = req;
  let bookings = [];
  const errors = [];
  try {
    const queryResult = await selectBySlug(req.params.slug);
    if (queryResult.length > 0) {
      event = queryResult[0];
    } else {
      next();
      return;
    }
  } catch (e) {
    console.error(e);
  }
  const { name, description } = event;
  const formData = { name, description };
  res.render('admin-event', {
    title: event.name,
    event,
    bookings,
    errors,
    username: user.username,
    formData,
  });
}

adminRouter.get('/:slug', ensureLoggedIn, catchErrors(eventRoute));

async function changeEvent(req, res) {
  const { name, description } = req.body;
  let success = true;
  let event = {};
  let slug = req.params.slug;
  try {
    const queryResult = await selectBySlug(slug);
    if (queryResult.length > 0) {
      event = queryResult[0];
    } else {
      next();
      return;
    }
  } catch (e) {
    console.error(e);
  }
  if (name !== event.name) {
    slug = await createSlug(name);
  }
  try {
    success = await updateEvent({
      name,
      description,
      slug,
      id: event.id,
    });
  } catch (e) {
    console.error(e);
    success = false;
  }

  if (success) {
    return res.redirect(`/admin/${slug}`);
  }

  return res.render('error', {
    title: 'Gat ekki uppfært viðburð!',
    text: 'Skráning gekk ekki eftir :/',
  });
}

adminRouter.post(
  '/:slug',
  validationMiddleware,
  xssSanitizationMiddleware,
  catchErrors(validationCheck),
  sanitizationMiddleware,
  catchErrors(changeEvent)
);
