const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', function (req, res, next) {
  res.render('signup', {
    title: 'Sign up',
  });
});

router.post('/', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;

  if (!username || !password || !repassword) {
    return res.render('signup', { title: 'Sign up', errorMessage: ['全ての項目を入力してください'] });
  }

  knex('users')
    .where({ name: username })
    .select('*')
    .then(function (result) {
      if (result.length !== 0) {
        return res.render('signup', { title: 'Sign up', errorMessage: ['このユーザ名は既に使われています'] });
      } else if (password === repassword) {
        knex('users')
          .insert({ name: username, password: password })
          .then(function () {
            res.redirect('/');
          })
          .catch(function (err) {
            console.error(err);
            res.render('signup', { title: 'Sign up', errorMessage: [err.sqlMessage || '登録に失敗しました'] });
          });
      } else {
        return res.render('signup', { title: 'Sign up', errorMessage: ['パスワードが一致しません'] });
      }
    })
    .catch(function (err) {
      console.error(err);
      res.render('signup', { title: 'Sign up', errorMessage: [err.sqlMessage || 'エラーが発生しました'] });
    });
});

module.exports = router;