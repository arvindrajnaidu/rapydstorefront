import firebase from "firebase/app";
import "firebase/database";

export const db = () => {
  return {
    getItem: async function (key) {
      try {
        let snap = await firebase.database().ref(key).once("value");
        if (snap.exists()) {
          console.log(snap.val());
          return snap.val();
        } else {
          return null;
        }
      } catch (e) {
        console.log(e);
      }
    },
    setItem: async function (key, val) {
      if (val) {
        debugger;
        await firebase.database().ref(key).set(val);
      }
    },
  };
};
