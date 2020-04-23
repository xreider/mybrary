const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/signin', async (req, res) => {
 
    res.render('user/signin', {
        isSignin: true
    });
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    }) 
})


router.post('/signin', async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) { 
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) throw err
                    res.redirect('/')
                })
            } else {
                res.redirect('/user/signin')
            }
        } else {
            res.redirect('/user/signin')
        }
    } catch (error) {
        console.log(error);
    }
})



router.get('/signup', async (req, res) => {
 
    res.render('user/signup', {
        isSignup: true
    });
})
router.post('/signup', async (req, res) => {
    try {
        const {name, email, password, repeatPassword} = req.body;
        const candidate = await User.findOne({email})

        if (candidate) {
            res.redirect('/user/signup')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                name, email, password: hashPassword,
            })
            await user.save()
            res.redirect('/user/signin')
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;