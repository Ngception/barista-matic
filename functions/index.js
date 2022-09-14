const admin = require('firebase-admin');
admin.initializeApp();
let db = admin.firestore();

const functions = require('firebase-functions');
const config = functions.config();

const cors = require('cors')({ origin: process.env.ORIGIN });
const stripeKey = config.stripe.key;
const stripe = require('stripe')(stripeKey);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

async function fetchData(table) {
  const records = db.collection(table);
  const list = [];

  return await records
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const item = {
          id: doc.id,
          ...doc.data(),
        };
        list.push(item);
      });
      return list;
    })
    .catch((err) => console.log(err));
}

exports.fetchInventory = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method === 'GET') {
      try {
        const ingredients = await fetchData('ingredients');
        response.send({
          data: ingredients,
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
});

exports.fetchDrinks = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method === 'GET') {
      try {
        const drinks = await fetchData('drinks');
        const ingredients = await fetchData('ingredients');

        const outOfStockDrinks = [];
        const availableDrinks = [];

        const ingredientCache = {};

        for (const ingredient of ingredients)
          ingredientCache[ingredient.name] = ingredient.quantity;

        for (let i = 0; i < drinks.length; i++) {
          let counter = 0;
          const drinkIngredients = drinks[i].ingredients;

          for (let j = 0; j < drinkIngredients.length; j++) {
            const current = drinkIngredients[j];
            if (current.units <= ingredientCache[current.name]) counter++;
          }

          if (counter < drinkIngredients.length)
            outOfStockDrinks.push(drinks[i]);
          else availableDrinks.push(drinks[i]);
        }

        response.send({
          availableDrinks,
          outOfStockDrinks,
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
});

exports.stripePayment = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method === 'POST') {
      try {
        const { amount } = request.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
        });

        response.send({
          paymentIntent,
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
});

exports.decrementInventory = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method === 'POST') {
      try {
        const dbIngredients = await fetchData('ingredients');
        const { cartItems } = request.body;

        const cache = {};
        const ingredientsToUpdate = cartItems.ingredients;

        for (const ingredient of ingredientsToUpdate)
          cache[ingredient.name] = ingredient.units;

        for (const dbIngredient of dbIngredients) {
          if (cache[dbIngredient.name]) {
            const difference = dbIngredient.quantity - cache[dbIngredient.name];

            if (difference < 0) {
              response.send({
                status: 'failed',
              });
              return;
            }

            db.collection('ingredients')
              .doc(dbIngredient.id)
              .update({ quantity: difference });
          }
        }
        response.send({
          status: 'succeeded',
        });
      } catch (err) {
        response.send({
          error: err,
        });
      }
    }
  });
});

exports.addInventory = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method === 'POST') {
      try {
        const dbIngredients = await fetchData('ingredients');
        const { ingredientsToUpdate } = request.body;

        for (const dbIngredient of dbIngredients) {
          if (ingredientsToUpdate[dbIngredient.name]) {
            const sum =
              Number(dbIngredient.quantity) +
              Number(ingredientsToUpdate[dbIngredient.name].units);

            db.collection('ingredients')
              .doc(dbIngredient.id)
              .update({ quantity: sum });
          }
        }
        response.send({
          status: 'succeeded',
        });
      } catch (err) {
        response.send({
          error: err,
        });
      }
    }
  });
});

exports.addDrink = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    if (request.method === 'POST') {
      try {
        const drinks = db.collection('drinks');
        const { customDrinkInfo } = request.body;
        const link = customDrinkInfo.name.toLowerCase().replace(' ', '-');

        const newDocument = {
          ...customDrinkInfo,
          link,
          image: process.env.NEW_DRINK_IMAGE,
          custom_drink: true,
        };

        drinks
          .add(newDocument)
          // eslint-disable-next-line promise/always-return
          .then((ref) => {
            console.log('Added document with ID: ', ref.id);
            response.send({
              status: 'succeeded',
            });
          })
          .catch((err) => console.log('Error creating document', err));
      } catch (err) {
        response.send({
          error: err,
        });
      }
    }
  });
});
