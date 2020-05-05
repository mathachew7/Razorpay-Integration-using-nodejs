var express = require("express");
var app = express();
var swig = require("swig");
var bodyParser = require("body-parser");
var Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: "YOUR KEY_ID",
  key_secret: "YOUR KEY_SECRET",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", __dirname + "/views");
var swig = new swig.Swig();
app.engine("html", swig.renderFile);
app.set("view engine", "html");

const PORT = 3000;
//INR
// amount is in paise here
// 100 paise = 1 INR
var amount = 10 * 100,
  currency = "INR",
  receipt = "1",
  payment_capture = true,
  notes = "something",
  order_id,
  payment_id;

app.get("/", (req, res) => {
  instance.orders
    .create({ amount, currency, receipt, payment_capture, notes })
    .then((response) => {
      order_id = response.id;
    })
    .catch((error) => {
      console.log(error);
    });
  //passing the order_id and amount to checkout page
  res.render("index", { order_id: order_id, amount: amount });
});
/*****************
 * Payment status*
 *****************/
app.post("/pay", (req, res) => {
  payment_id = req.body;
  console.log("**********Payment authorized***********");
  instance.payments
    .fetch(payment_id.razorpay_payment_id)
    .then((response) => {
      instance.payments
        .capture(payment_id.razorpay_payment_id, response.amount)
        .then((response) => {
          res.send(response);
          console.log("**all the information related payment is here **");
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(PORT, () => {
  console.log("server is running in port:", PORT);
  console.log(
    "type localhost:3000 in your browser to check the example of razorpay."
  );
});
