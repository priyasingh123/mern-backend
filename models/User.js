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

module.exports = mongoose.model('user', UserSchema)