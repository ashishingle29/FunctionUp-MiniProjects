const express = require('express')
const mongoose = require('mongoose')
const router = require('./route/route')

const app = express()

app.use(express.json())

mongoose.set('strictQuery', true) 

mongoose.connect("mongodb+srv://aashu:root@mini-project-cluster.kzrvbeg.mongodb.net/Covid-Vaccine-Slot-Book?retryWrites=true&w=majority")
.then(() => console.log("MongoDB is connected"))
.catch(err => console.log(err))


app.use('/', router)

app.use('/', function (_, res) {
    res.status(404).send({ status: false, message: "Url not found" })
})

app.listen(3000, () => console.log('Server is started to Rock 🔥🔥🔥'))

