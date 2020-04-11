const express = require('express');
const router = express.Router();
const Author = require('../models/author')

// All Authors
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name !== null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {authors,
                                    searchOptions: req.query});
    } catch (error) {
        res.redirect('/')
    }
})

// New Author
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author() });
})

// Create Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        await author.save();
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors/new', { }) 
    } catch (error) {
        res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author'})
    }
 
})

module.exports = router;