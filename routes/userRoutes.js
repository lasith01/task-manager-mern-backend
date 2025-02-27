const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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

module.exports = router;