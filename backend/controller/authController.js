const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('brcypt');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const registeruser = async (requestAnimationFrame, res) => {
    try{
        const{name , email, password, role} = requestAnimationFrame.body;

        const userExists = await user.findOne({email});
        if(userExists){
            return res.status(400).json({message: 'user already exists'});
        }

        const hashedpassword = await User.bcrypt.hashed(password, 10);
        const user = await User.create({name, email, password : hashedpassword, role});

        if(user){
            res.status(201).json({
                id: user._id,
                name : user.name,
                email : user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } 
        else{
            res.status(401).json({message: 'Invaild email or password'});
        }
    } catch(error){
        console.error('Signup error' , error.message);
        res.status(500).json({message: 'Server error'});
    }
};


const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ message: 'Server error during login' });
    }
  };

module.export = {registeruser, loginUser}