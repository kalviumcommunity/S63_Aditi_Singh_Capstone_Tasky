const jwt  = require('jsonwebtoken');
const User = require('../models/UserModel');

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith('Bearer')){
        try{
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error){
            return resizeBy.status(401).json({message: 'Not authorized, token failed'})
        }
    } else{
        res.status(401).json({message: 'No authourization, token expired'});
    }
};

const adminMiddleware = (req, res, next) => {
    if(req.user && req.user.role === 'Admin'){
        next();
    } else{
        res.status(403).json({message: 'Access denied: for admins only'})
    }
};

module.exports = {authMiddleware, adminMiddleware};