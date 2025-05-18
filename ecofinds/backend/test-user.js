const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const user = new User({
      email: 'test2@example.com',
      password: 'hashedpassword',
      username: 'test2'
    });
    await user.save();
    console.log('User saved');
    mongoose.disconnect();
  })
  .catch(err => console.log('Error:', err));