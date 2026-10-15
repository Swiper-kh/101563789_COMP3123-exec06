require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/NoteRoutes.js');

// MongoDB Atlas URL is read from the .env file (DB_URL=...)
const DB_URL = process.env.DB_URL || "";
const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Note taking application - Week06 Exercise</h1>");
});

// FIX: Note routes were never registered with the app
// All note endpoints live under /api  ->  http://localhost:8081/api/notes
app.use('/api', noteRoutes);

if (!DB_URL) {
    console.log('DB_URL is not set. Add it to your .env file.');
    process.exit(1);
}

// Connect to the database
// FIX: removed useNewUrlParser / useUnifiedTopology (deprecated, no effect in Mongoose 8)
mongoose.connect(DB_URL).then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");
    app.listen(PORT, () => {
        // FIX: log the real port (was hard-coded "3000")
        console.log(`Server is listening on port ${PORT}`);
    });
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit(1);
});
