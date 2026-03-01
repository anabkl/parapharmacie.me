const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret_key);

admin.initializeApp();

exports.createStripeSession = functions.https.onCall(async (data, context) => {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: data.items.map(item => ({
      price_data: {
        currency: "mad",
        product_data: { name: item.title },
        unit_amount: item.price * 100
      },
      quantity: item.qty
    })),
    success_url: data.successUrl,
    cancel_url: data.cancelUrl
  });

  return { sessionId: session.id };
});
