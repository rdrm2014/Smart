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
    res.render('index', {title: 'Smart-*'});
});

router.get('/home', isLoggedIn, function (req, res) {
    console.log(req.user);
    res.render('home', {
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

    /*
     var unirest = require('unirest');


     // POST a form with an attached file
     unirest.post('http://localhost:1881/red/auth/token')
     //unirest.post('http://localhost:1881/red/login')
     .send({client_id:"node-red-admin", grant_type:"password",scope:"*", username:"admin", password:"password"})
     //.attach('myfile', 'examples.js')
     .end(function (res) {
     if (res.error) {
     console.log('POST error', res.error);
     } else {
     console.log('POST response', res.body);
     // GET a resource

     unirest.get('http://localhost:1881/red/settings')
     .headers({
     'Accept': 'application/json',
     'Authorization': res.body["token_type"]+" "+res.body["access_token"]
     })
     .end(function (res) {
     if (res.error) {
     console.log('GET error', res.error)
     } else {
     console.log('GET response', res.body);
     res1.redirect(req.user.urlNodeRed);
     }
     })
     }
     })*/
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