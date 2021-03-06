const express = require('express');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const csrf = require('csurf');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CSRF
const csrfProtection = csrf({
  cookie: true,
});
app.use(csrfProtection);
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get('/jwt', (req, res) => {
  const token = jsonwebtoken.sign({ user: 'johndoe' }, jwtSecret);
  res.cookie('token', token, { httpOnly: true });
  res.json({ token });
});

//  order matters !!!
const jwtSecret = 'secret123';
app.use(
  jwt({
    secret: jwtSecret,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.token,
  }),
);

const foods = [
  { id: 1, description: 'burritos' },
  { id: 2, description: 'quesadillas' },
  { id: 3, description: 'churos' },
];

app.get('/foods', (req, res) => {
  res.json(foods);
});

app.post('/foods', (req, res) => {
  foods.push({
    id: foods.length + 1,
    description: 'new food',
  });
  res.json({
    message: 'Food created!',
  });
});

app.listen(3001);
console.log('App running on localhost:3001');
