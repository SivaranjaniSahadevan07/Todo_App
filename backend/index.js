const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const connectDB = require('./config/db')
const todoRoute = require('./routes/todoRoute')

connectDB()

// routes
app.use('/', todoRoute);

// handles invalid routes
app.get('*', ( req, res)=>{
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'))
})

// error handling route
app.use('/', (err, req, res, next)=>{
    res.status(500).send('Internal server error')
})

// starts the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


