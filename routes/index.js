/**
 * @swagger
 * resourcePath: /index
 * description: All about API
 */

/**
 * Created by ricardomendes on 10/01/17.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Smart*'});
});

router.get('/home', isLoggedIn, function (req, res) {
    console.log(req.user);
    res.render('home', {
        title: 'Smart*',
        user: req.user
    });
});

/**
 * @swagger
 * path: /nodered
 * operations:
 *   -  httpMethod: GET
 *      summary: Access to node-red instance
 *      nickname: nodered
 *      consumes:
 *        - text/html
 */
router.get('/nodered', isLoggedIn, function (req, res1) {
    res1.redirect(req.user.urlNodeRed);
});

/**
 * @swagger
 * path: /ui
 * operations:
 *   -  httpMethod: GET
 *      summary: Access to node-red UI
 *      nickname: ui
 *      consumes:
 *        - text/html
 */
router.get('/ui', isLoggedIn, function (req, res) {
    res.redirect(req.user.urlNodeRed + "ui");
});

module.exports = router;


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}