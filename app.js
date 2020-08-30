const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        name: "Amir Debbie",
        number: "040-782398",
        id: 1
    },
    {
        name: "Gili Debbie",
        number: "560-783453498",
        id: 2
    },
    {
        name: "Shahar Debbie",
        number: "230-78233333",
        id: 3
    }
]

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const idParam = Number(req.params.id);
    const person = persons.find(person => idParam === person.id)

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const idParam = Number(req.params.id);
    persons = persons.filter(person => idParam !== person.id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
    }

    if (persons.some(person => person.name === req.body.name)) {
        return res.status(400).json({ 
          error: 'name exits in phone book' 
        })
    }

    const newPerson = {
        name: req.body.name,
        number: req.body.number,
        id: getRandomInt(1000)
    }

    persons.push(newPerson);
    res.json(newPerson);
})

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(
        `<p>Phone book has info for ${persons.length} people.</p>
         <p>${date.toString()}</p>`
    )
})
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})