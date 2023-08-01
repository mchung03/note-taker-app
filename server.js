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

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if(err) {
            console.log(err)
        }
        const notes = JSON.parse(data)
        res.json(notes);
    })
})

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if(err) {
            console.log(err)
        }

        const notes = JSON.parse(data);
        const newNote = {
            id: uniqid(),
            title: req.body.title,
            text: req.body.text
        }
        notes.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(notes, null, 4), () => {
            console.log("Updated db.json!")
            res.json(notes);
        })
    })
    
})

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
)


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
)