const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    let token;

    if (req.headers.authorization ){
        try{
            token = req.headers.authorization;
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }catch (error) {
            res.status(401).json({message: "Authentication Failed, Invalid Token"});
        }
    }else{
        res.status(401).json({message: "No token, Authentication Failed"});
    }
};

module.exports = auth;