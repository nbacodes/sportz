import express from 'express'

const app = express();
const port = 8000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from basic verson of index.js')
})

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
})




