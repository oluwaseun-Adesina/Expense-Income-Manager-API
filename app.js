const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const userRoutes = require('./routes/userRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
const handleRecurrence = require('./utils/recurrenceHandler');

// const {connectRedis} = require('./config/redis')
const session = require('express-session')
// const redisStore = require('connect-redis')
const compression = require('compression')

// db
const connectDB = require('./config/mongodb')
connectDB()
// compression

// async function redisClient(){
//     await connectRedis()
// }
app.disable('x-powered-by');
// MIDDLEWARES
app.use(cors());
app.use(express.json())

app.use( compression() );

// app.use(session({
//     secret: process.env.SESSION_SECRET, // Use a secret from your environment variables
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // Set to true if using HTTPS
// }));
// app.use(
//     session({
//         secret: "LoginRadius",
//         resave: false,
//         saveUninitialized: false,
//         store: new redisStore({ client: redisClient})
//     })
// )


// routes
app.use('/api/users', userRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
// app.use('/api/categories', categoryRoutes);

app.use((req, res) => {
    res.status(404).json({message: "Page Not Found"})
 });
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})