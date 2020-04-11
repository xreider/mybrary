const express = require('express');
const router = express.Router();
const Book = require('../models/book')
const Author = require('../models/author')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg','image/png','image/gif'];
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // console.log('smth file=>', file);
        cb(null, uploadPath)
      },
    filename(req, file, cb) {
      cb(null, Date.now() + '-' + Math.random() +  '-' + file.originalname)
    }
  })

const upload = multer({
    storage,
  fileFilter: (req, file, callback) => {
      callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Books Route
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({})
        res.render('books/index', {
            books,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/');
    }
})

// New Book
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
 console.log(req.file)
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description,
    })

    try {
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books') 
    } catch (error) { 
        if (book.coverImageName != null) removeBookCover(book.coverImageName) 
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) { 
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err);
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({}) 
        const params = {
            authors,
            book,
        }
        if (hasError) params.errorMessage = 'Error Creating Book';
        res.render('books/new', params)
    } catch (error) {
        res.redirect('/books')
    }
}

module.exports = router;