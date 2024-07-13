require('dotenv').config()

const path = require("path")
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const auctionRoutes = require('./routes/auction')
const userRoutes = require('./routes/user')
const {errorHandler} = require('./middlewares/errorMiddleware')
const cookieParser = require('cookie-parser')
const {authorizeAdmin} = require('./middlewares/errorMiddleware')
const uploadRoutes = require('./routes/upload')
const orderRoutes = require('./routes/order')
const http = require('http');
const { Server } = require('socket.io');

//express app
const app = express()

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Client URL
        methods: ["GET", "POST"]
    }
});

//middleware
app.use(express.json())
app.use(errorHandler);
app.use(cookieParser());


app.use((req,res, next)=>{
    console.log(req.path, req.method)
    next()
})


//routes
app.use(cors())
app.use('/api/auction', auctionRoutes)
app.use('/api/user', userRoutes)
app.use("/api/upload", uploadRoutes);
app.use("/api/order", orderRoutes);


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


app.set('io', io);

const url = process.env.MONG_URI



//conect DB
mongoose.connect(url)
    .then(()=>{
        //listen
        server.listen(process.env.PORT,()=>{
            console.log('connected to db and listening on port', process.env.PORT)
        })
    })
    .catch((error)=>{
        console.log(error)
    })

