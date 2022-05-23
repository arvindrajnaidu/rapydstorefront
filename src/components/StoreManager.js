import React from "react";
import CasualSeller from "casualseller";
import { Button } from "@material-ui/core";
import firebase from "firebase/app";

function StoreManager() {
    
  return <div>
    <CasualSeller />
    <Button onClick={() => {
      firebase.auth().signOut()
    }}>
      {'Logout'}
    </Button>
  </div>
}

export default StoreManager;
