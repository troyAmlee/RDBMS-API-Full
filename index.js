const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
    res.json({ api: 'Runnin' });
});

server.get('/api/cohorts', (req, res) => {
    db('cohorts')
    .then(cohort => res.status(200).json(cohort))
    .catch(error => res.status(500).json({ message: `Can't Retrieve Cohort Data`, error }))

});

server.get('/api/cohorts/:id', (req, res) => {
    const { id } = req.params
    console.log(id)
    db('cohorts')
    .where({id})
    .then(cohort => res.status(201).json({cohort}))
    .catch(error => res.status(500).json({ message: 'Could not find cohort specified', error }))
});

server.get('/api/cohorts/:id/students', (req, res) => {
    const { id } = req.params
    console.log({id})
    
    db('students')
    // .where({id})
    .join('cohorts', 'cohorts.id', '=', 'students.cohort_id')
    .where('students.id', '=', id)
    .then(student => res.status(200).json(student))
    .catch(error => res.status(500).json({message: "You done f'd up", error}))
});

server.post('/api/cohorts', (req, res) => {
    const cohort = req.body
    db('cohorts').insert(cohort)
    .then(ids => {
        res.status(201).json(ids)
    })
    .catch(err => res.status(500).json({ message: 'Error Posting New Cohort', err }))
});

server.put('/api/cohorts/:id', (req, res) => {
    const changes = req.body;
    const { id } = req.params;

    db('cohorts')
    .where({ id })
    .update(changes)
    .then(count => {
        res.status(200).json({ count });
    })
    .catch(err => res.status(500).json(err));
});

server.delete('/api/cohorts/:id', (req, res) => {
    const { id } = req.params;

    db('students')
    .where({ id })
    .del()
    .then(count => {
        res.status(200).json({ count });
    })
    .catch(err => res.status(500).json(err));
});

const port = 7777;
server.listen(port, function() {
    console.log(`\n=== Web Api Listening @ http://localhost:${port} ===\n`);
})