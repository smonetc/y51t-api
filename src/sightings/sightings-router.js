const path = require('path')
const express = require('express')
const SightingsService = require('./sightings-service')

const sightingsRouter = express.Router()
const jsonParser = express.json()

const serializeSightings = sighting => ({
    id: sighting.id,
    location_name: sighting.location_name,
    date_viewed: sighting.date_viewed,
    category_id: sighting.category_id,
    content: sighting.content,
    username: sighting.username
})

sightingsRouter
.route('/')
.get((req,res,next) => {
    SightingsService.getAllSightings(req.app.get('db'))
    .then(sighting => {
        res.json(sighting.map(serializeSightings))
    })
    .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const {location_name,date_viewed, category_id, content,username} = req.body
    const newSighting = {location_name,date_viewed,category_id,content}

    for (const [key, value] of Object.entries(newSighting)) {
        if (value == null) {
            return res.status(400).json ({
                error: {message: `Missing '${key}' in request body`}
            })
        }
    }

    newSighting.username = username
    SightingsService.insertSighting(
        req.app.get('db'),
        newSighting
    )
    .then( sighting => {
        res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${sighting.id}`))
        .json(serializeSightings(sighting))
    })
    .catch(next)
})

sightingsRouter
.route('/:sighting_id')
.all( (req, res, next) => {
    SightingsService.getById(
        req.app.get('db'),
        req.params.sighting_id
    )
    .then(sighting => {
        if (!sighting){
            return res.status(400).json({
                error: {message: `Sighting not found`}
            })
        }
        res.sighting = sighting
        next()
    })
    .catch(next)
})
.get((req,res,next) => {
    res.json(
        {
            id: res.sighting.id,
            location_name: res.sighting.location_name,
            date_viewed: res.sighting.date_viewed,
            category_id: res.sighting.category_id,
            content: res. sighting.content,
            username: res.sighting.username
        }
    )
})
.patch(jsonParser, (req,res,next) => {
    const {location_name,date_viewed, category_id, content,username} = req.body
    const sightingToUpdate = {location_name,date_viewed,category_id,content}

    const numberOfValues = Object.values(sightingToUpdate).filter(Boolean).length

    if (numberOfValues === 0) {
        return res.status(400).json({
        error: {
        message: `Request body must contain either 'location_name','date_viewed', 'category_id', 'content'`}
      })
    }

    SightingsService.updateSighting(
        req.app.get('db'),
        req.params.sighting_id,
        sightingToUpdate
    )
    .then(()=> {
        res.status(204).end()
    })
    .catch(next)
})
.delete((req, res, next) => {
    SightingsService.deleteSighting(
        req.app.get('db'),
        req.params.sighting_id
    )
    .then(() => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = sightingsRouter