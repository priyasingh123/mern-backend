const mongoose = require ('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema ({
    name: {
        type: String,
        isRequired: true
    },
    email: {
        type: String,
        isRequired: true,
        unique: true
    },
    password: {
        type: String,
        isRequired: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', UserSchema)
User.createIndexes();// ensures no duplicate value is there 
module.exports = User