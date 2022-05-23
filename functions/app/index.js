const functions = require("firebase-functions");
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const Rapyd = require("../lib/rapyd");
const moment = require("moment");
require("moment-timezone");

const firebaseConfig = {
  apiKey: "AIzaSyA-9chYdnRAg-92Pf-fYakzv7-pAhp03Yo",
  authDomain: "freshcatch-700a3.firebaseapp.com",
  databaseURL:
    "https://freshcatch-700a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "freshcatch-700a3",
  storageBucket: "freshcatch-700a3.appspot.com",
  messagingSenderId: "995836996592",
  appId: "1:995836996592:web:9ffda8b37f48806d550b35",
  measurementId: "G-GTMS72C6C5",
};

const rapydClient = Rapyd();

module.exports = (admin) => {
  const app = express();
  app.engine("handlebars", exphbs());
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "views"));

  app.get("/:merchantId/carts", async (req, res) => {
    const { merchantId } = req.params;
    const { amt } = req.query;
    console.log(amt, '<<<')
    let xo = await rapydClient.createToken({ amt });
    console.log(xo, '<<<< xo')
    // const snapshot = await admin.database().ref(`/merchants/${merchantId}/orders/${xoId}`).once('value')
    // const order = snapshot.val()
    // if (!table) {
    //   return res.status(404).send()
    // }
    
    const newOrderRef = admin
      .database()
      .ref(`/merchants/${merchantId}/online_orders`)
      .push();
    const id = newOrderRef.getKey();

    let orderForDB = {
      id,
      xoId: xo.id,
      tax: 0,
      timeIn: moment().valueOf(),
      total: amt,
      status: "OPEN",
      phoneNumber: "+14082194490",
    };
    console.log("Updating", orderForDB);
    await newOrderRef.set(orderForDB);
    // Set the table's orderId
    // await admin.database().ref(`/merchants/${merchantId}/tables/${tableNo}/orderId`).set(tranNo)
    return res.redirect(`/${merchantId}/orders/${id}`);
  });

  app.get(
    ["/:merchantId/orders/:orderId", "/:merchantId/**"],
    async function (req, res) {

      try {
        const { merchantId, orderId } = req.params;
        const initialState = {
          merchant: {
            name: `Rita's Cafe`,
          },
          firebaseConfig,
          orderId,
        };
        
        initialState.merchant.paymentProvider = "rapyd";

        return res.render("xo", {
          layout: false,
          xoId: JSON.stringify(orderId),
          merchantId: JSON.stringify(merchantId)
        });
      } catch (e) {
        console.log(e);
        res.status(500).end();
      }
    }
  );

  app.get("/:merchantId", async function (req, res) {
    const { merchantId } = req.params;
    if (Number.isNaN(parseInt("merchantId"))) {
      return res.status(404).send();
    }

    const snapshot = await admin
      .database()
      .ref(`/merchants/${merchantId}/profile`)
      .once("value");
    const { name, imageUrl, whatsApp } = snapshot.val();

    // console.log(name, imageUrl, rapydAccount)
    const initialState = {
      merchant: { name, imageUrl, whatsApp },
      firebaseConfig,
    };
    return res.render("landing", {
      layout: false,
      initialState: JSON.stringify(initialState),
    });
  });

  return app;
};
