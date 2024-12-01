const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use(morgan('request: :method :url, status: :status, length: :res[content-length], :response-time ms :body'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Defines an event handler used to handle 
// HTTP GET requests made to the application's /root.
// The request parameter contains all of the information 
// of the HTTP request, and the second response parameter 
// is used to define how the request is responded to.
// In this case, the request is answered by using the 
// send method of the response object
app.get('/', (request, response) => {
  response.send('<h1>Phonebook homepage!</h1>')
})

app.get('/api/info', (request, response) => {
    response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `)
  })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 10000)
  return String(id)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }


  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name already exists in the phonebook' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
