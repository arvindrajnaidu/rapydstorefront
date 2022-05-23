const CryptoJS = require("crypto-js");
const fetch = require("axios");

const Rapyd = () => {
  return {
    async createToken({ amt }) {
      const http_method = "post"; // get|put|post|delete - must be lowercase.
      const url_path = "/v1/checkout"; // Portion after the base URL. Hardkeyed for this example.
      const salt = CryptoJS.lib.WordArray.random(12); // Randomly generated for each request.
      const timestamp = (
        Math.floor(new Date().getTime() / 1000) - 10
      ).toString();
      // Current Unix time (seconds).
      const access_key = "4C4CC04982E326770898"; // The access key received from Rapyd.
      const secret_key =
        "b1281aab5d9bdd54cb14fae3f0f6338eedacc99d2fd89151b271af7b865bf8e7c26f883ada7e0764"; // Never transmit the secret key by itself.
      const expiration = Date.now() + 60000;
      const body = {
        amount: amt,
        complete_payment_url: "http://example.com/complete",
        country: "SG",
        currency: "SGD",
        error_payment_url: "http://example.com/error",
        merchant_reference_id: "0912-2021",
        language: "en",
        metadata: {
          merchant_defined: true,
        },
        payment_method_types_include: ["sg_grabpay_ewallet"],
        expiration: Math.floor(new Date().getTime() / 1000) + 60000,
      }; // JSON body goes here. Always empty for GET;
      // strip nonfunctional whitespace.

      // if (JSON.stringify(request.data) !== '{}' && request.data !== '') {
      //     body = JSON.stringify(JSON.parse(request.data));
      // }

      var to_sign =
        http_method +
        url_path +
        salt +
        timestamp +
        access_key +
        secret_key +
        JSON.stringify(body);

      // console.log(to_sign)
      var signature = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA256(to_sign, secret_key)
      );

      signature = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(signature)
      );

      // console.log({
      //     access_key,
      //     salt: '' + salt,
      //     timestamp,
      //     signature,
      //     'Content-Type': 'application/json'
      // })

      let xoResponse = await fetch.post(
        "https://sandboxapi.rapyd.net/v1/checkout",
        body,
        {
          headers: {
            access_key,
            salt: "" + salt,
            timestamp,
            signature,
            idempotency: CryptoJS.lib.WordArray.random(8).toString(),
            "Content-Type": "application/json",
          },
          // body
        }
      );
      return xoResponse.data.data;
    },
  };
};

module.exports = Rapyd
