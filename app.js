/* eslint-disable comma-dangle */
import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
// import mongoose
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import session from 'express-session';
import flash from 'connect-flash';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
// routes admin
import adminRouter from './routes/admin';
// routes api
import apiRouter from './routes/api';

const URI = 'mongodb://127.0.0.1:27017/db_staycation';
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
mongoose.connect(URI, OPTIONS);

const app = express();

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));
app.use(
  '/sb-admin-2',
  express.static(join(__dirname, 'node_modules/startbootstrap-sb-admin-2'))
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
// admin
app.use('/admin', adminRouter);
// api
app.use('/api/v1/member', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
