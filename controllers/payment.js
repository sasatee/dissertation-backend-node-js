// const sendEmail = require("./../util/email");
// const stripe = require("stripe")(
//  process.env.STRIPE_SECRET
// );
// const paymentIntent = async (req, res) => {
//  try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: req.body.amount,
//       currency: 'usd',
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     const message = `Thank you. Please verify your email by entering the verification code below: \n\n${verifytoken}\n\nIf you did not request this, please ignore this email.`;

//     await sendEmail({
//       email: user.email,
//       subject: "Email Verification",
//       message: message,
//     });


//     res.json({ paymentIntent: paymentIntent.client_secret });
//   } catch (e) {
//     res.status(400).json({
//       error: e.message,
//     });
//   }
// };

// module.exports = { paymentIntent };


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

    const user = req.body.user; // Assuming user information is sent in the request body
    const orderID = paymentIntent.id; // Payment order ID
    const amount = req.body.amount / 100; // Convert amount to dollars

    const message = `Thank you for your payment. Your payment order ID is ${orderID} and the amount charged is $${amount}.`;

    await sendEmail({
      email: user.email,
      subject: "Payment Confirmation",
      message: message,
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

module.exports = { paymentIntent };

