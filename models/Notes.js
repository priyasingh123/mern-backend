const mongoose = require ('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema ({
    title: {
        type: string,
        isRequired: true
    },
    description: {
        type: string,
        isRequired: true
    },
    tag: {
        type: string,
        default: 'general'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('notes', NotesSchema)