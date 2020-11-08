const SightingsService = {
    getAllSightings(knex){
        // return knex
        // .select('*')
        // .from('sightings')
        return knex
        .raw(`SELECT s.id, s.location_name,s.date_viewed, s.content, s.username, ca.category FROM sightings s
        LEFT JOIN category ca ON s.category_id = ca.id`)
    },
    insertSighting(knex, newSightings) {
        return knex
        .insert(knex.raw(newSightings))
        // .into('sightings')
        // .returning('*')
        // .returning(knex.raw(`SELECT s.id, s.location_name,s.date_viewed, s.content, s.username, ca.category FROM sightings s
        // LEFT JOIN category ca ON s.category_id = ca.id`))
        .then(rows => {
            return rows[0]
        })
      },
    getById(knex, id) {
        return knex
        .raw(`SELECT s.id, s.location_name,s.date_viewed, s.content, s.username, ca.category FROM sightings s
        LEFT JOIN category ca ON s.category_id = ca.id`)
        // .from('sightings')
        // .select('*')
        .where('id', id)
        .first()
    },
    deleteSighting(knex, id) {
       return knex('sightings')
        .where({ id })
        .delete()
    },
    updateSighting(knex, id, newSightingsFields) {
        return knex('sightings')
        .where({ id })
        .update(newSightingsFields)
    },
}
module.exports = SightingsService