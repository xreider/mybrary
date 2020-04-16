const express = require('express');
const router = express.Router();
const Book = require('../models/book')
const Author = require('../models/author')
// const path = require('path');
// const fs = require('fs');
// const uploadPath = path.join('public', Book.coverImageBasePath);
// const multer = require('multer');
const imageMimeTypes = ['image/jpeg','image/png','image/gif'];
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         // console.log('smth file=>', file);
//         cb(null, uploadPath)
//       },
//     filename(req, file, cb) {
//       cb(null, Date.now() + '-' + Math.random() +  '-' + file.originalname)
//     }
//   })

// const upload = multer({
//     storage,
//   fileFilter: (req, file, callback) => {
//       callback(null, imageMimeTypes.includes(file.mimetype))
//   }
// })

// All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != '' && req.query.title != ' ') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '' && req.query.publishedBefore != ' ') {
        query = query.lte('publishDate', req.query.publishedBefore)
    } 
    if (req.query.publishedAfter != null && req.query.publishedAfter != '' && req.query.publishedAfter != ' ') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
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
router.post('/', async (req, res) => { 
    // const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        // coverImageName: fileName,
        description: req.body.description,
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`) 
    } catch (error) { 
        // if (book.coverImageName != null) removeBookCover(book.coverImageName) 
        renderNewPage(res, book, true)
    }
})

router.get('/:id', async (req, res) => { 
 
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/page', {book})
    } catch (error) { 
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book) 
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

// function removeBookCover(fileName) { 
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err);
//     })
// }

router.put('/:id', async (req, res) => { 
 let book 

    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover != '') {
            saveCover(book, req.body.cover)
        }
        await book.save();
        res.redirect(`/books/${book.id}`)
    } catch (error) { 
        console.log(error);
        if (book != null) {
            renderEditPage(res, book, true) 
        } else {
            res.redirect('/')
        } 
    }
})

router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch (error) {
        if (book != null) {
            res.render('books/show', {
                book, errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
        console.log(error);
    }
})

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    }
}

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({}) 
        const params = {
            authors,
            book,
        }
        if (hasError) {
            if (form === 'edit') params.errorMessage = 'Error Editing Book'
            if (form === 'new') params.errorMessage = 'Error Creating Book'
        };
        res.render(`books/${form}`, params)
    } catch (error) {
        res.redirect('/books')
    }
}

module.exports = router;