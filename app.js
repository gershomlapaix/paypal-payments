const dotenv = require('dotenv').config()

const express  = require('express')
const paypal = require('paypal-rest-sdk')
const app = express()


const port = process.env.PORT || 3000
app.listen(port, ()=>console.log(`App's running`))