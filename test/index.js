/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import Chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

Chai.use(chaiHttp);

describe('API ENDPOINT TESTING', () => {
  it('GET Landing Page', (done) => {
    Chai.request(app)
      .get('/api/v1/member/landing-page')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('hero');
        expect(res.body.hero).to.have.all.keys(
          'travelers',
          'treasures',
          'cities'
        );
        expect(res.body).to.have.property('mostPicked');
        expect(res.body.mostPicked).to.have.an('array');
        expect(res.body).to.have.property('categories');
        expect(res.body.categories).to.have.an('array');
        expect(res.body).to.have.property('testimonial');
        expect(res.body.testimonial).to.have.an('object');
        done();
      });
  });

  it('GET Detail Page', (done) => {
    Chai.request(app)
      .get('/api/v1/member/detail-page/5e96cbe292b97300fc902222')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('item');
        expect(res.body.item).to.be.an('object');
        expect(res.body).to.have.property('testimonial');
        expect(res.body.testimonial).to.have.an('object');
        done();
      });
  });
});
