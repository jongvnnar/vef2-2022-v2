import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import { listEvents, selectBySlug, selectEventBookings } from '../lib/db.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  const events = await listEvents();

  res.render('index', {
    title: 'Viðburðasíðan',
    subtitle: 'Viðburðir',
    events,
  });
}

indexRouter.get('/', catchErrors(indexRoute));

async function eventRoute(req, res, next) {
  let event = {};
  let bookings = [];
  try {
    const queryResult = await selectBySlug(req.params.slug);
    if (queryResult.length > 0) {
      event = queryResult[0];
      bookings = await selectEventBookings(event.id);
    } else {
      next();
      return;
    }
  } catch (e) {
    console.error(e);
  }
  res.render('event', { title: event.name, event, bookings });
}

indexRouter.get('/:slug', catchErrors(eventRoute));
