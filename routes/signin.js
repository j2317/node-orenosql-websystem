const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', function (req, res, next) {
  const userId = req.session ? req.session.userid : undefined;
  const isAuth = Boolean(userId);

  res.render('signin', {
    title: 'Sign in',
    isAuth: isAuth,
  });
});

router.post('/', function (req, res, next) {
  const userId = req.session ? req.session.userid : undefined;
  const isAuth = Boolean(userId);
  const username = req.body.username;
  const password = req.body.password;

  knex('users')
    .where({ name: username, password: password })
    .select('*')
    .then((results) => {
      if (results.length === 0) {
        res.render('signin', {
          title: 'Sign in',
          errorMessage: ['ユーザが見つかりません'],
          isAuth: isAuth,
        });
      } else {
        req.session.userid = results[0].id;
        res.redirect('/');
      }
    })
    .catch(function (err) {
      console.error(err);
      res.render('signin', {
        title: 'Sign in',
        errorMessage: [err.sqlMessage || 'エラーが発生しました'],
        isAuth: isAuth,
      });
    });
});

module.exports = router;
