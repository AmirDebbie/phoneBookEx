require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT;
const Person = require('./models/person.js')


app.use(express.static('build'));
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
    Person.find({}).then((result) => {
        res.json(result);
      });
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end();
        }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
    }

    const person = new Person({
        name: req.body.name,
        number: req.body.number,
    })

    person.save().then((result) => {
        res.json(result);
    })
})

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(
        `<p>Phone book has info for ${persons.length} people.</p>
         <p>${date.toString()}</p>`
    )
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})