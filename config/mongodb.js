const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

const dbURL = process.env.DATABASE_URL;

// Function to connect to the database
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(dbURL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        if (connection.connection.readyState === 1) {
            console.log("Database Connected");
        } else {
            console.log('Error Connecting to database');
        }

    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = connectDB;
