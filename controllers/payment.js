const stripe = require("stripe")(
 process.env.STRIPE_SECRET
);
const paymentIntent = async (req, res) => {
 try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'mur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

module.exports = { paymentIntent };
