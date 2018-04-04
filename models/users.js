const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = new Schema({
    twitterId: String,
    username: String,
    displayName: String,
    imageUrl: String
});

module.exports = mongoose.model('User', User);
