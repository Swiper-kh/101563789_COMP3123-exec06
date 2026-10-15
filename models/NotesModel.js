const mongoose = require('mongoose');

// Note Schema
//  - noteTitle
//  - noteDescription
//  - priority (HIGH, MEDIUM or LOW)
//  - dateAdded
//  - dateUpdated
const NoteSchema = new mongoose.Schema({
    noteTitle: {
        type: String,
        required: [true, 'Note title is required'],
        trim: true
    },
    noteDescription: {
        type: String,
        trim: true,
        default: ''
    },
    priority: {
        type: String,
        enum: {
            values: ['HIGH', 'MEDIUM', 'LOW'],
            message: 'Priority must be HIGH, MEDIUM or LOW'
        },
        uppercase: true,
        default: 'LOW'
    },
    dateAdded: {
        type: String,
        default: () => formatDate(new Date())
    },
    dateUpdated: {
        type: String,
        default: () => formatDate(new Date())
    }
});

// Formats a date like the sample payload: 06/Oct/2025
function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${months[date.getMonth()]}/${date.getFullYear()}`;
}

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
module.exports.formatDate = formatDate;
