const dotenv = require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const paypal = require("paypal-rest-sdk");

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
              price: "64.00",
              currency: "USD",
              quantity: 2,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "128.00",
        },
        description: "Shoes for formal and ceremonial activities.",
      },
    ],
  };

  try {
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        // console.log(payment);
        const { links } = payment;

        for (const linkObj of links) {
          if (linkObj.rel === "approval_url") {
            res.redirect(linkObj.href);
          }
        }
      }
    });
  } catch (err) {
    console.log(`something wrong happened`);
  }
});

app.get("/success", (req, res) => {
//   console.log(req.query); // for testing
  const { PayerID } = req.query;
  const { paymentId } = req.query;

  //   execute payments
  const execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "128.00",
        },
      },
    ],
  };

//   paypal.payment.execute(
//     paymentId,
//     execute_payment_json,
//     function (error, payment) {
//       if (error) {
//         console.log(error.response);
//         throw error;
//       } else {
//         console.log(payment);
//         // to be put in the database later
//         console.log(JSON.stringify(payment));
//         res.send("Success");
//       }
//     }
//   );
});

// app.get("/cancel", (req, res) => {
//   res.send("Payment process cancelled");
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App's running`));
