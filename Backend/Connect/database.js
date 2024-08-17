const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://mohammadrobass:CHiXmRBdOLmVBmYL@cluster0.tyvjy.mongodb.net/';

async function connectToDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

module.exports = connectToDatabase;
