import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
const chai = use(chaiHttp);

import nock from 'nock';

import jwt from 'jsonwebtoken';

import app from '../index.js';

const remoteApiResponse = [
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 6695,
      "duration": 17,
      "type": "train",
      "id": "9f715bbc-bcf2-4033-96f5-47212b167aba",
      "display_name": "from SYD to MEL by train"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 1098,
      "duration": 42,
      "type": "flight",
      "id": "b38e8a99-fb05-4752-892d-46454b8dc746",
      "display_name": "from SYD to MEL by flight"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 5149,
      "duration": 13,
      "type": "flight",
      "id": "16eb3de4-0a89-48b7-9436-9905a7154b08",
      "display_name": "from SYD to MEL by flight"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 4035,
      "duration": 32,
      "type": "flight",
      "id": "df1d5d9c-9876-4d35-811e-4229f4ac62f8",
      "display_name": "from SYD to MEL by flight"
  }
];

const scope = nock(process.env.BIZAWAY_API_HOST + '/')
  .persist()
  .get('/default/trips?origin=SYD&destination=MEL')
  .reply(200, remoteApiResponse);

const fastestResponse = [
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 5149,
      "duration": 13,
      "type": "flight",
      "id": "16eb3de4-0a89-48b7-9436-9905a7154b08",
      "display_name": "from SYD to MEL by flight"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 6695,
      "duration": 17,
      "type": "train",
      "id": "9f715bbc-bcf2-4033-96f5-47212b167aba",
      "display_name": "from SYD to MEL by train"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 4035,
      "duration": 32,
      "type": "flight",
      "id": "df1d5d9c-9876-4d35-811e-4229f4ac62f8",
      "display_name": "from SYD to MEL by flight"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 1098,
      "duration": 42,
      "type": "flight",
      "id": "b38e8a99-fb05-4752-892d-46454b8dc746",
      "display_name": "from SYD to MEL by flight"
  }
];

const cheapestResponse = [
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 1098,
      "duration": 42,
      "type": "flight",
      "id": "b38e8a99-fb05-4752-892d-46454b8dc746",
      "display_name": "from SYD to MEL by flight"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 4035,
      "duration": 32,
      "type": "flight",
      "id": "df1d5d9c-9876-4d35-811e-4229f4ac62f8",
      "display_name": "from SYD to MEL by flight"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 5149,
      "duration": 13,
      "type": "flight",
      "id": "16eb3de4-0a89-48b7-9436-9905a7154b08",
      "display_name": "from SYD to MEL by flight"
  },
  {
      "origin": "SYD",
      "destination": "MEL",
      "cost": 6695,
      "duration": 17,
      "type": "train",
      "id": "9f715bbc-bcf2-4033-96f5-47212b167aba",
      "display_name": "from SYD to MEL by train"
  }
];

describe('Trip Controller', function() {
  function token() {
    return jwt.sign(
      {
        email: 'test',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  };

  describe('GET api/trips', function() {
    it('should return 401 with invalid auth token', function(done) {
      chai.request.execute(app)
        .get('/api/v1/trips')
        .query({ origin: 'foo', destination: 'bar', sort_by: 'fastest' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should return 422 with invalid origin or destination', function(done) {
      chai.request.execute(app)
        .get('/api/v1/trips')
        .set('Authorization', `Bearer ${token()}`)
        .query({ origin: 'foo', destination: 'bar', sort_by: 'fastest' })
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });

    it('should return 422 with invalid sort_by', function(done) {
      chai.request.execute(app)
        .get('/api/v1/trips')
        .set('Authorization', `Bearer ${token()}`)
        .query({ origin: 'SYD', destination: 'MEL', sort_by: 'invalid' })
        .end((err, res) => {
          expect(res).to.have.status(422);
          done();
        });
    });

    it('should return trips ordered by duration if sort_by = fastest', function(done) {
      chai.request.execute(app)
        .get('/api/v1/trips')
        .set('Authorization', `Bearer ${token()}`)
        .query({ origin: 'SYD', destination: 'MEL', sort_by: 'fastest' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.trips).to.deep.equal(fastestResponse);
          done();
        });
    });

    it('should return trips ordered by cost if sort_by = cheapest', function(done) {
      chai.request.execute(app)
        .get('/api/v1/trips')
        .set('Authorization', `Bearer ${token()}`)
        .query({ origin: 'SYD', destination: 'MEL', sort_by: 'cheapest' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.trips).to.deep.equal(cheapestResponse);
          done();
        });
    });
  })
});
