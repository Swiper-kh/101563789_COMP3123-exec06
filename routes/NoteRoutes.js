const mongoose = require('mongoose');
const express = require('express');
// FIX: model file is models/NotesModel.js (was '../models/Notes.js')
const noteModel = require('../models/NotesModel.js');
const { formatDate } = require('../models/NotesModel.js');

const noteRoutes = express.Router();

// Helper - checks for a valid MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new Note
// http://mongoosejs.com/docs/api.html#document_Document-save
noteRoutes.post('/notes', async (req, res) => {
    // Validate request
    if (!req.body || !req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    try {
        const note = new noteModel(req.body.content);
        const savedNote = await note.save();
        res.status(201).send(savedNote);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send({ message: err.message });
        }
        res.status(500).send({ message: err.message || "Error occurred while creating the Note" });
    }
});

// Retrieve all Notes
// http://mongoosejs.com/docs/api.html#find_find
// FIX: removed body validation - GET requests have no body
noteRoutes.get('/notes', async (req, res) => {
    try {
        const notes = await noteModel.find();
        res.status(200).send(notes);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error occurred while retrieving Notes" });
    }
});

// Retrieve a single Note with noteId
// http://mongoosejs.com/docs/api.html#findbyid_findById
// FIX: removed body validation - GET requests have no body
noteRoutes.get('/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;
    if (!isValidId(noteId)) {
        return res.status(400).send({ message: `Invalid note id ${noteId}` });
    }

    try {
        const note = await noteModel.findById(noteId);
        if (!note) {
            return res.status(404).send({ message: `Note not found with id ${noteId}` });
        }
        res.status(200).send(note);
    } catch (err) {
        res.status(500).send({ message: err.message || `Error retrieving Note with id ${noteId}` });
    }
});

// Update a Note with noteId
// http://mongoosejs.com/docs/api.html#findbyidandupdate_findByIdAndUpdate
noteRoutes.put('/notes/:noteId', async (req, res) => {
    // Validate request
    if (!req.body || !req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    const { noteId } = req.params;
    if (!isValidId(noteId)) {
        return res.status(400).send({ message: `Invalid note id ${noteId}` });
    }

    try {
        const update = { ...req.body.content };
        if (!update.dateUpdated) {
            update.dateUpdated = formatDate(new Date());
        }

        const note = await noteModel.findByIdAndUpdate(noteId, update, {
            new: true,            // return the updated document
            runValidators: true   // enforce schema rules (e.g. priority enum)
        });

        if (!note) {
            return res.status(404).send({ message: `Note not found with id ${noteId}` });
        }
        res.status(200).send(note);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send({ message: err.message });
        }
        res.status(500).send({ message: err.message || `Error updating Note with id ${noteId}` });
    }
});

// Delete a Note with noteId
// FIX: findByIdAndRemove was removed in Mongoose 8 - using findByIdAndDelete
// https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()
// FIX: removed body validation - DELETE requests have no body
noteRoutes.delete('/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;
    if (!isValidId(noteId)) {
        return res.status(400).send({ message: `Invalid note id ${noteId}` });
    }

    try {
        const note = await noteModel.findByIdAndDelete(noteId);
        if (!note) {
            return res.status(404).send({ message: `Note not found with id ${noteId}` });
        }
        res.status(200).send({ message: "Note deleted successfully!", deletedNote: note });
    } catch (err) {
        res.status(500).send({ message: err.message || `Could not delete Note with id ${noteId}` });
    }
});

module.exports = noteRoutes;
