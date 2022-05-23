import "./App.css";
import firebase from "firebase/app";
import Auth from "./components/Auth";
import UserProvider, { UserContext } from "./UserProvider";
import { useContext } from "react";
import StoreManager from "./components/StoreManager";
import Store from "./components/Store";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Container } from "@material-ui/core";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-9chYdnRAg-92Pf-fYakzv7-pAhp03Yo",
  authDomain: "freshcatch-700a3.firebaseapp.com",
  databaseURL: "https://freshcatch-700a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "freshcatch-700a3",
  storageBucket: "freshcatch-700a3.appspot.com",
  messagingSenderId: "995836996592",
  appId: "1:995836996592:web:9ffda8b37f48806d550b35",
  measurementId: "G-GTMS72C6C5",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


function Admin({ user }) {
  if (user) {
    return <StoreManager />;
  } else {
    return <Auth />;
  }
}

function StoreFront() {
  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Store />}/>
      <Route path="/admin" element={<Admin user={user}/>}/>
    </Routes>
  </BrowserRouter>
  );
}

function App() {
  return (
    <UserProvider>
      <Container>
        <StoreFront />
      </Container>
    </UserProvider>
  );
}

export default App;
