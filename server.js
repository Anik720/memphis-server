const mongoose = require('mongoose');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 5000;

dotenv.config({ path: './.env' });

const URL = process.env.DB;
console.log(URL);
mongoose.connect(URL, {}).then(() => {
  console.log('DB connected Successfully!');
});

const app = require('./app');
const express = require('express');

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
