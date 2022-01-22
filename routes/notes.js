const express = require('express');

const router = express.Router();

const notesController = require('../controllers/notes')

router.get('/',notesController.getAbout);

router.get('/add-notes',notesController.getAddNotes);

router.get('/edit-notes/:noteId',notesController.getEditNotes);

router.post('/edit-notes',notesController.postEditNotes);

router.get('/mynotes',notesController.getMyNotes);

router.post('/add-notes',notesController.postAddNotes);

router.post('/delete-note',notesController.postDeleteNote);

module.exports = router;