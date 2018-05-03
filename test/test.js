'use strict';

const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-http'));

//const app = require('../app.js'); // Our app
//const app = "http://127.0.0.1:3000"; // Our app
const app = "http://192.168.160.11:3000"; // Our app

describe('API endpoint /api', function () {
    this.timeout(5000); // How long to wait for a response (ms)
    // GET - API
    it('API /api GET', function (done) {
        chai.request(app)
            .get('/api')
            .end(function (err, res) {
                if (err) return done(err);

                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                done();
            });
    });
});

describe('API endpoint /users/authenticate', function () {
    it('it responds with 401 status code if bad username or password', function (done) {
        chai.request(app)
            .post('/users/authenticate')
            .type('json')
            .send({username: "err@err.pt", password: "err"})
            .end(function (err, res) {

                if (err) {

                    expect(res).to.have.status(401);
                    expect(res.text).to.equal('Unauthorized');
                    done();
                }
            });
    });

    it('it responds with 200 status code if good username or password', function (done) {
        chai.request(app)
            .post('/users/authenticate')
            .type('json')
            .send({username: "teste@teste.pt", password: "teste"})
            .end(function (err, res) {
                if (err) return done(err);

                expect(res).to.have.status(200);

                done();
            });

    });

    it('it returns JWT token if good username or password', function (done) {
        chai.request(app)
            .post('/users/authenticate')
            .type('json')
            .send({username: "teste@teste.pt", password: "teste"})
            .end(function (err, res) {
                if (err) return done(err);

                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).have.property('token');

                done();
            });
    });
});


describe('API endpoint /api', function () {
    this.timeout(5000); // How long to wait for a response (ms)

    var token;
    //beforeEach(function (done) {
    before(function (done) {
        chai.request(app)
            .post('/users/authenticate')
            .type('json')
            .send({username: "teste@teste.pt", password: "teste"})
            .end(function (err, res) {
                token = res.body.token;
                done();
            });
    });

    describe('API endpoint /api/installs', function () {
        this.timeout(5000); // How long to wait for a response (ms)

        var idInstall;
        //beforeEach(function (done) {
        before(function (done) {
            chai.request(app)
                .get('/api/installs/')
                .set('Authorization', token)
                .end(function (err, res) {

                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    //expect(res.body).to.be.an('object');
                    idInstall = res.body[0]._id;

                    done();
                });
        });

        // GET /api/installs - API
        it('API /api/installs GET', function (done) {

            chai.request(app)
                .get('/api/installs/')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    //expect(res.body).to.be.an('object');
                    done();
                });
        });

        // GET /api/installs/count - API
        it('API /api/installs/count GET', function (done) {

            chai.request(app)
                .get('/api/installs/count')
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    //expect(res.body).to.be.an('object');
                    done();
                });
        });

        // GET /api/installs/<idInstall> - API
        it('API /api/installs/<idInstall> GET', function (done) {

            chai.request(app)
                .get('/api/installs/' + idInstall)
                .set('Authorization', token)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    //expect(res.body).to.be.an('object');
                    done();
                });
        });

        describe('API endpoint /api/installs/<idInstall>/equipments', function () {
            this.timeout(5000); // How long to wait for a response (ms)

            var idEquipment;
            //beforeEach(function (done) {
            before(function (done) {
                chai.request(app)
                    .get('/api/installs/' + idInstall + '/equipments')
                    .set('Authorization', token)
                    .end(function (err, res) {

                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        //expect(res.body).to.be.an('object');
                        idEquipment = res.body[0]._id;

                        done();
                    });
            });

            // GET /api/installs/<idInstall>/equipments - API
            it('API /api/installs/<idInstall>/equipments GET', function (done) {

                chai.request(app)
                    .get('/api/installs/' + idInstall + '/equipments')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        //expect(res.body).to.be.an('object');
                        done();
                    });
            });

            // GET /api/installs/<idInstall>/equipments/count - API
            it('API /api/installs/<idInstall>/equipments/count GET', function (done) {

                chai.request(app)
                    .get('/api/installs/' + idInstall + '/equipments/count')
                    .set('Authorization', token)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        //expect(res.body).to.be.an('object');
                        done();
                    });
            });

            // GET /api/installs/<idInstall>/equipments/<idEquipment> - API
            it('API /api/installs/<idInstall>/equipments/<idEquipment> GET', function (done) {

                chai.request(app)
                    .get('/api/installs/' + idInstall + '/equipments/' + idEquipment)
                    .set('Authorization', token)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        //expect(res.body).to.be.an('object');
                        done();
                    });
            });

            describe('API endpoint /api/installs/<idInstall>/equipments/<idSensor>/sensors', function () {
                this.timeout(5000); // How long to wait for a response (ms)

                var idSensor;
                //beforeEach(function (done) {
                before(function (done) {
                    chai.request(app)
                        .get('/api/installs/' + idInstall + '/equipments/'+idEquipment+'/sensors')
                        .set('Authorization', token)
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            //expect(res.body).to.be.an('object');
                            idSensor = res.body[0]._id;

                            done();
                        });
                });

                // GET /api/installs/<idInstall>/equipments/<idEquipment>/sensors - API
                it('API /api/installs/<idInstall>/equipments/<idEquipment>/sensors GET', function (done) {

                    chai.request(app)
                        .get('/api/installs/' + idInstall + '/equipments/'+idEquipment+'/sensors')
                        .set('Authorization', token)
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            //expect(res.body).to.be.an('object');
                            done();
                        });
                });

                // GET /api/installs/<idInstall>/equipments/<idEquipment>/sensors/<idSensor> - API
                it('API /api/installs/<idInstall>/equipments/<idEquipment>/sensors/<idSensor> GET', function (done) {

                    chai.request(app)
                        .get('/api/installs/' + idInstall + '/equipments/' + idEquipment+'/sensors/'+idSensor)
                        .set('Authorization', token)
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            //expect(res.body).to.be.an('object');
                            done();
                        });
                });

            });
        });
    });

});
