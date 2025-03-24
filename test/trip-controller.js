import sinon from 'sinon';
import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
const chai = use(chaiHttp);

import jwt from 'jsonwebtoken';

import app from '../index.js';

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
  })
});
