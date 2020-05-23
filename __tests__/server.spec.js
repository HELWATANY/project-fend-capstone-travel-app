const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../src/server');
chai.use(chaiHttp);

describe('Get Country List', () => {
  beforeEach(async () => {
    await server.start();
  });

  afterEach(() => {
    server.stop();
  });

  it('Should return a list of countries', async () => {
    return chai.request('localhost:8081')
      .get('/countries')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.be.an('object')
          .to.have.own.property('geonames');
      })
      .catch((err) => {
        throw err;
      });
  });
});
