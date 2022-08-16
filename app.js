const dotenv = require("dotenv").config();

const express = require("express");
const ejs = require("ejs");

// paypal configuration
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));
app.post("/pay", (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    },
    transactions: [
      {
        // should come from the database
        item_list: {
          items: [
            {
              name: "Best Italian shoes",
              sku: "001",
              price: "32.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "64.00",
        },
        description: "Shoes for formal and ceremonial activities.",
      },
    ],
  };


   
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App's running`));
