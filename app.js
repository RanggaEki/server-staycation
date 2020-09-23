/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
const createError = require('http-errors');
const express = require('express');

const { json, urlencoded } = express;
const { join } = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// import mongoose
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// routes admin
const adminRouter = require('./routes/admin');
// routes api
const apiRouter = require('./routes/api');

const URI =
  'mongodb+srv://ranggasyahrial:BWAMERN@cluster0.sikrw.mongodb.net/db_staycation?retryWrites=true&w=majority';
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
