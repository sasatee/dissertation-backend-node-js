const stripe = require("stripe")(
  "sk_test_51NVzlNDK8Xa4nOxws2wu1zQ7C6ZRNadOzmGTau1V4w5w55gwYKqAkW9ChWtQpWV0NGzHoU4VpsTJfB2hhFQZE2SJ00FLpMGGTE"
);
const paymentIntent = async (req, res) => {
 try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
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
