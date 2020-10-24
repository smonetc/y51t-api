const path = require('path')
const express = require('express')
const CategoryService = require('./category-service')

const categoryRouter = express.Router()
const jsonParser = express.json()

const serializeCategory = category => ({
    id: category.id,
    title: category.category,
})

categoryRouter
.route('/')
.get((req,res,next) => {
    CategoryService.getAllCategories(req.app.get('db'))
    .then(category => {
        res.json(category.map(serializeCategory))
    })
    .catch(next)
})
.post(jsonParser, (req,res,next) => {
    const { category } = req.body
    const newCategory = {category}

    for (const [key, value] of Object.entries(newCategory)) {
        if (value == null) {
        return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
         })
       }
    }

    newCategory.category = category
    CategoryService.insertCategory(
        req.app.get('db'), 
        newCategory
    )
    .then(category => {
        res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${category.id}`))
        .json(serializeCategory(category))
    })
    .catch(next)
})

categoryRouter
.route('/:category_id')
.all((req,res,next) => {
    CategoryService.getById(
        req.app.get('db'),
        req.params.category_id
    )
    .then(category => {
        if(!category) {
            return res.status(400).json({
                error: {message: `Category not found`}
            })
        }
        res.category = category
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json({
        id: res.category.id,
        category: res.category.category,
    })
})
.patch(jsonParser, (req, res, next) => {
    const { category} = req.body
    const categoryToUpdate = { category }
    
    const numberOfValues = Object.values(categoryToUpdate).filter(Boolean).length
    
    if (numberOfValues === 0) {
    return res.status(400).json({
    error: {
    message: `Request body must contain 'category'`}
  })
    }
    CategoryService.updateCategory(
        req.app.get('db'),
        req.params.category_id,
        categoryToUpdate
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})
.delete((req, res, next) => {
    CategoryService.deleteCategory(
        req.app.get('db'),
        req.params.category_id
    )
    .then(() => {
        res.status(204).end()
    })
    .catch(next)
})
module.exports = categoryRouter