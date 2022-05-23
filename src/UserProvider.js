import React, { useEffect, createContext, useState, useReducer } from "react";
import firebase from "firebase/app";
//   import "firebase/firestore";
import "firebase/auth";
//   import { setUserId } from "../lib/logger";

export const UserContext = createContext({});

function reducer(state, action) {
  switch (action.type) {
    case "set-user": {
      return { ...state, user: action.user };
    }
    default:
      return state;
  }
}

const getUserFromClaims = (claims) => {
  if (!claims) return null;
  // console.log(claims)
  return {
    uid: claims.uid,
    name: claims.name,
    email: claims.email,
    providerId: claims.provider_id,
  };
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});

  // const refreshUser = () => {
  //   const user = firebase.auth().currentUser
  //   setUser({
  //     uid: user.uid,
  //     name: user.name,
  //     email: user.email,
  //     providerId: user.providerId,
  //   })
  // }
  // console.log(claims, '<<<')
//   useEffect(() => {
//     //   setUser(getUserFromClaims(claims));
//     console.log(firebase.auth().currentUser)
//     debugger
//   }, [firebase.auth().currentUser]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
            type: 'set-user',
            user: {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                providerId: user.providerId
            }
        })
      } else {
        dispatch({
            type: 'set-user',
            user: null
        })
      }
    });
  }, [])

  // useEffect(() => {
  //   if (!claims) return;
  //   setUserId(claims.uid)
  // }, [claims && claims.uid])

  return (
    <UserContext.Provider value={{ ...state }}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
