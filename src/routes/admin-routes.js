import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import {
  listEvents,
  selectBySlug,
  selectEventBookings,
  insertBooking,
} from '../lib/db.js';
import { body, validationResult } from 'express-validator';
import xss from 'xss';

export const adminRouter = express.Router();
