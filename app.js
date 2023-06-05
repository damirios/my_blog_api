const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRouter = require('./routes/user_router');
const postRouter = require('./routes/post_router');

require('dotenv').config();
const PORT = process.env.DB_PORT;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

// routers
app.use('/user', userRouter);
app.use('/post', postRouter);


async function start() {
    try {
        await mongoose.connect(DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        app.listen(PORT, () => console.log("server started at port " + PORT));
    } catch (error) {
        console.log(error);
    }
}

start();