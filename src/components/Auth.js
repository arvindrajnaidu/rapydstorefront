import React, { useContext, useEffect, useRef } from "react";
import firebase from "firebase/app";

import { useTheme } from "@material-ui/core";
import { UserContext } from "../UserProvider";

const Auth = ({ successCallback }) => {
  const loginDiv = useRef();
  const theme = useTheme();
  const {dispatch} = useContext(UserContext)

  const handleUIError = (error) => {
    if (error.code === "firebaseui/anonymous-upgrade-merge-conflict") {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          firebase.auth().signInWithCredential(error.credential);
        });
    }
    console.error(error);
  };

  useEffect(() => {
    const fbUI = async () => {
      const firebaseui = await import("firebaseui");
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebase.auth());
      ui.start(loginDiv.current, {
        autoUpgradeAnonymousUsers: true,
        callbacks: {
          signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            var user = authResult.user;
            dispatch({
                type: 'set-user',
                user,
            })
            
            // var credential = authResult.credential;
            // var isNewUser = authResult.additionalUserInfo.isNewUser;
            // var providerId = authResult.additionalUserInfo.providerId;
            // var operationType = authResult.operationType;
            // const getToken = async () => {
            //   let idToken = await user.getIdToken();
            //   await fetch("/api/login", {
            //     method: "POST",
            //     body: JSON.stringify({
            //       idToken,
            //     }),
            //   });
            //   logEvent("login_success");
            //   if (successCallback) {
            //     successCallback(idToken);
            //   }
            // };
            // getToken();
            return false;
          },
          signInFailure: function (error) {
            // Some unrecoverable error occurred during sign-in.
            // Return a promise when error handling is completed and FirebaseUI
            // will reset, clearing any UI. This commonly occurs for error code
            // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
            // occurs. Check below for more details on this.
            return handleUIError(error);
          },
          uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById('loader').style.display = 'none';
          },
        },
        // signInSuccessUrl: "/auth/post-login",
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            buttonColor: theme.palette.primary.main,
          },
        ],
      });
    };
    fbUI();
  }, []);

  return <div style={{marginTop: 100}} ref={loginDiv} id="loginDiv" />;
};

export default Auth;
