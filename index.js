require('dotenv').config();
const express = require("express");
const path = require("path");
const axios = require('axios');

const cookieParser = require('./middleware/cookieParser.js');


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true} ));

app.use(express.static(path.join(__dirname, 'client/dist')))

app.use(cookieParser);

// Routes


// Listen
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const ADDRESS = HOST + ':' + PORT;

app.listen(PORT, () => {
  console.log(`Listening at: ${ADDRESS}`)
})