const SightingsService = {
    getAllSightings(knex){
        return knex
        .select('*')
        .from('sightings')
    },
    insertSighting(knex, newSightings) {
        return knex
        .insert(newSightings)
        .into('sightings')
        .returning('*')
        .then(rows => {
            return rows[0]
          })
      },
    getById(knex, id) {
        return knex
        .from('sightings')
        .select('*')
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