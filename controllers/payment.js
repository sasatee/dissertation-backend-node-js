const sendEmail = require("./../util/email");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const paymentIntent = async (req, res) => {

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({ paymentIntent: paymentIntent.client_secret });

    // Send email after ensuring the response status is 200
    if (res.statusCode === 200) {
      const orderID = paymentIntent.id; 
      const amount = req.body.amount;
      const message = `Thank you for your payment. Your payment order ID is ${orderID} and the amount charged is $${amount}.`;

      await sendEmail({
        email: 'dexyfplay@gmail.com',
        subject: "Payment Confirmation",
        message: message,
      });
    }
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

module.exports = { paymentIntent };
