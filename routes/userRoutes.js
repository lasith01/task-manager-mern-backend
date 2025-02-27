const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// User Register
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if (userExists) return res.status(400).json({message: "User already exists"});

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: hashPassword});

    res.status(201).json({
        _id: user.id, name: user.name, email: user.email, token: generateToken(user.id)
    });
});

//User Login
router.post('/login', async(req, res) =>{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (user && await bcrypt.compare(password, user.password)){
        res.json({
            _id: user.id, name: user.name, email: user.email, token: generateToken(user.id)
        });
    }else{
        res.status(401).json({message: "Invalid Credentials"});
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); 
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json({ _id: user.id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;