const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
// MySQL connection via knex is configured in ../knexfile.js and db/knex.js

router.get('/', function (req, res, next) {
  const userId = req.session ? req.session.userid : undefined;
  const isAuth = Boolean(userId);

  knex('tasks')
    .select('*')
    .then(function (results) {
      res.render('index', {
        title: 'ToDo App',
        todos: results,
        isAuth: isAuth,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
      });
    });
});

router.post('/', function (req, res, next) {
  const userId = req.session ? req.session.userid : undefined;
  const isAuth = Boolean(userId);
  const todo = req.body.add;

  knex('tasks')
    .insert({ user_id: userId, content: todo })
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
      });
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;