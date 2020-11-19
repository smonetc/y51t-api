const knex = require('knex')
const app = require('../src/app')
const { makeSightingsArray } = require('./sightings.fixture')
// const {makeCategoryArray} = require('./category.fixtures')

describe('Sightings Endpoints', function() {
    let db

    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.DATABASE_URL, //process.env.TEST_DB_URL
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('sightings').truncate())

    afterEach('cleanup', () => db('sightings').truncate())

    describe(`GET /api/sightings`, () => {
        context(`Given no sightings`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/sightings')
              .expect(200, [])
            })
        })
        context('Given there are sightings in the database', () => {
            // const testCategory = makeCategoryArray();
            const testSightings = makeSightingsArray()
    
            beforeEach('insert sightings', () => {
            return db
                    .into('sightings')
                    .insert(testSightings)
            })
    
            it('responds with 200 and all of the sightings', () => {
            return supertest(app)
                .get('/api/sightings')
                .expect(200, testSightings)
            })
        })
    })
    describe(`POST /api/sightings`, () => {
        it('adds a new sighting to the store', () => {
            const newSighting = {
                "location_name":"test",
                "date_viewed":"2018-12-21T00:00:00.000Z",
                "category_id":2,
                "content":"test test",
                "username":"test"
            }
            return supertest(app)
              .post(`/api/sightings`)
              .send(newSighting)
              .expect(201)
              .expect(res => {
                expect(res.body.location_name).to.eql(newSighting.location_name)
                expect(res.body.date_viewed).to.eql(newSighting.date_viewed)
                expect(res.body.category_id).to.eql(newSighting.category_id)
                expect(res.body.content).to.eql(newSighting.content)
                expect(res.body.username).to.eql(newSighting.username)
                expect(res.body).to.have.property('id')
                expect(res.headers.location).to.eql(`/api/sightings/${res.body.id}`)
              })
              .then(res =>
                supertest(app)
                  .get(`/api/sightings/${res.body.id}`)
                  .expect(res.body)
              )
        }) 
        const requiredFields = ['location_name', 'date_viewed', 'category_id', 'content']

        requiredFields.forEach(field => {
        const newSighting = {
        "location_name":"test",
        "date_viewed":"2018-12-21T00:00:00.000Z",
        "category_id":2,
        "content":"test test",
        }

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newSighting[field]

        return supertest(app)
            .post('/api/sightings')
            .send(newSighting)
            .expect(400, {
            error: { message: `Missing '${field}' in request body` }
            })
        })
        }) 
    })
    describe(`GET /api/sightings/:sighting_id`, () => {
        context('Given there are sightings in the database', () => {
            const testSightings = makeSightingsArray()
      
            beforeEach('insert sightings', () => {
              return db
                .into('sightings')
                .insert(testSightings)
            })
      
            it('responds with 200 and the specified sighting', () => {
              const sightingId = 2
              const expectedSighting = testSightings[sightingId - 1]
              return supertest(app)
                .get(`/api/sightings/${sightingId}`)
                .expect(200, expectedSighting)
            })
        })
    })
    describe(`PATCH /api/sightings/:sighting_id`, () => {
        context('Given there are sightings in the database', () => {
            const testSightings = makeSightingsArray()
        
            beforeEach('insert sightings', () => {
               return db
                .into('sightings')
                .insert(testSightings)
            })
        
            it('responds with 204 and updates the sightings', () => {
               const idToUpdate = 2
               const updateSighting = {
                "location_name":"Montana",
                "date_viewed":"2018-12-21T00:00:00.000Z",
                "category_id":2,
                "content":"test test",
                "username":"Brandon"
            }
                const expectedSighting = {
                     ...testSightings[idToUpdate - 1],
                     ...updateSighting
                }

               return supertest(app)
                .patch(`/api/sightings/${idToUpdate}`)
                .send(updateSighting)
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get(`/api/sightings/${idToUpdate}`)
                        .expect(expectedSighting)
                )
            })
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                .patch(`/api/sightings/${idToUpdate}`)
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                    error: {
                        message: `Request body must contain either 'location_name', 'date_viewed', 'category_id', or 'content'`
                    }
                })
            })
        })
    }) 
   describe(`Delete /api/sightings/:sighting_id`, () => {
      // context(`Given no sightings`, () => {

      //    })
      context('Given there are sightings in the database', () => {
         const testSightings = makeSightingsArray()

      beforeEach('insert sightings', () => {
         return db
            .into('sightings')
            .insert(testSightings)
            })

      it('responds with 204 and removes the sighting', () => {
            const idToRemove = 2
            const expectedSightings = testSightings.filter(sighting => sighting.id !== idToRemove)
            return supertest(app)
            .delete(`/api/sightings/${idToRemove}`)
            .expect(204)
            .then(res =>
               supertest(app)
                  .get(`/api/sightings`)
                  .expect(expectedSightings)
               )
         })
      })  
   })
   describe(`GET /api/category`, () => {
        context(`Given there are categories `, () => {
        it(`responds with 200`, () => {
            return supertest(app)
            .get('/api/category')
            .expect(200)
            })
        })
    })
})   