require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const {readdirSync} = require('fs')
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// database connection
// connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

const port = process.env.PORT || 8080;


const server = () => {
    connection()
    app.listen(port, () => {
        console.log('listening to port:', port)
    })
}

server()