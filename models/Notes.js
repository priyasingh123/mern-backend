const mongoose = require ('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema ({
    //user added to differentiate notes based on userId
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        isRequired: true
    },
    description: {
        type: String,
        isRequired: true
    },
    tag: {
        type: String,
        default: 'general'
    },
    date: {
        type: Date,
        default: Date.now
    }
})


//recommended to use singular and Capitalised name for model 
module.exports = mongoose.model('notes', NotesSchema)