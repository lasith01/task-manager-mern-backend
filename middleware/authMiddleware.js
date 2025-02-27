const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userID).select('-password');
            next();
        }catch (error) {
            res.status(401).json({message: "Authentication Failed, Invalid Token"});
        }
    }else{
        res.status(401).json({message: "No token, Authentication Failed"});
    }
};

module.exports = auth;