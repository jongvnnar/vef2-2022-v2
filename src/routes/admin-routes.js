import express from 'express';
import xss from 'xss';

import passport, { ensureLoggedIn } from '../lib/login.js';
import { catchErrors } from '../lib/catch-errors.js';
import { listEvents } from '../lib/db.js';

export const adminRouter = express.Router();

async function index(req, res) {
  const { user } = req;
  const events = await listEvents();

  res.render('index', {
    title: 'Viðburðasíðan - Umsjón',
    subtitle: 'Viðburðir',
    events,
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
