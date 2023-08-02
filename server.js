//import necessary npms
const express = require('express');
const path = require('path')
const fs = require('fs')
const uniqid = require('uniqid')

const PORT = 3001;

const app = express();

// middlewares
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// HTML route to notes.html
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

// api route that reads json file and returns saved notes
app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if(err) {
            console.log(err)
        }
        const notes = JSON.parse(data)
        res.json(notes);
    })
})

// api post route
app.post('/api/notes', (req, res) => {
    // reads new note to save and return to client
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if(err) {
            console.log(err)
        }

        const notes = JSON.parse(data);
        const newNote = {
            // uniqid npm for generating id
            id: uniqid(),
            title: req.body.title,
            text: req.body.text
        }
        // pushes new note to db.json
        notes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(notes, null, 4), () => {
            console.log("Updated db.json!")
            res.json(notes);
        })
    })
    
})

// HTML route to index.html for anything except /notes
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
)

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
)