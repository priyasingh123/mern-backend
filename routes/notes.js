const express = require('express')
const fetchuser = require('../middleware/fetchuser')


const router = express.Router()
const Notes = require('../models/Notes')
const {body, validationResult} = require('express-validator')

//ROUTE 1 
//GET: get all notes using '/api/notes/fetchallnotes'. Login required
router.get ('/fetchallnotes',fetchuser, async (req,res) => {
    const notes = await Notes.find({user: req.user.id})
    console.log ('Notes ', notes)
    res.send(notes)
})



//ROUTE 2
//POST: add notes using POST: '/api/notes/addnote'. Login required
router.post ('/addnote',[
    body('title','Enter valid title').isLength({min: 3}),
    body('description','Enter a valid description').isLength({min: 5})
],fetchuser, async (req,res) => {

    const {tag, title, description} = req.body
    //validationResult will return array for errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }

    try {
        /*METHOD-1*/
        // const notes = await new Notes({tag, title, description})
        // const savedNote = await notes.save()

        /*METHOD-2*/
        const notes = await Notes.create({
            tag, title, description, user: req.user.id
        })
        res.json(notes)
    } catch (error) {
        console.log ({error: error.message})
        res.status(500).send("Bad Request")
    }
    // try {
    //     const { title, description, tag } = req.body;

    //     // If there are errors, return Bad request and the errors
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({ errors: errors.array() });
    //     }
    //     const note = new Notes({
    //         title, description, tag, user: req.user.id
    //     })
    //     const savedNote = await note.save()

    //     res.json(savedNote)

    // } catch (error) {
    //     console.error(error.message);
    //     res.status(500).send("Internal Server Error");
    // }
})



//ROUTE-3
//PUT: add notes using PUT: '/api/notes/updatenote'. Login required

//id of note to be updated will be part of path
router.put ('/updatenote/:id',fetchuser, async (req, res) => {
    //destructure what user has sent in req as title, desc and tag
    const {title, description, tag} = req.body
    //create new note 
    const newNote = {}
    if (title) newNote.title = title
    if (tag) newNote.title = tag
    if (description) newNote.title = description
    
    try {
        //find note with sent id 
        let note = await Notes.findById(req.params.id)

        if (!note) {
            res.status(400).send ('Bad Request')
        }

        //check if user is legitimate user to update note
        if (note.user != req.user.id) {
            return res.status(403).send('Forbidden content')
        }
        //valid user updating his own note
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.send({note})
        //condition for not same user 
    } catch (error) {
        console.log (error.message)
        res.status(500).send('Internal server error')
    }
})


//ROUTE-4
//DELETE existing note using DELETE: '/api/notes/updatenote'. Login required
router.delete('/deletenote/:id',fetchuser, async (req,res) => {
    try {
        //logged in user is "req.user"
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(400).send('Bad Request')
        }

        //check if valid user is deleting note
        if (note.user != req.user.id) {
            return res.status(403).send('User Forbidden to delete content')
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({success: 'deleted successfully', note: note})
    } catch (error) {
        console.log (error.message)
        res.status(500).send('Internal server error')
    }
    
})



module.exports = router