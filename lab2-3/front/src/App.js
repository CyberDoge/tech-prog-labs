import './App.css';
import Main from "./pages/Main";
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Socket from "./utils/Socket";
import Chat from "./pages/Chat";

let primarySocket;

function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    primarySocket = new Socket();
    primarySocket.onOpenHandler = () => {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        primarySocket.send((data, error) => {
          localStorage.setItem("token", JSON.stringify(data))
          setLoaded(true)
        }, "reg_anonymous", null)
      } else {
        primarySocket.send((data, error) => {
          document.querySelector("body").append(JSON.stringify(data))
          setLoaded(true)
        }, "token_auth", token)
      }
    }

  }, [])

  return (
    <Router>
      {loaded ? (
          <>
            <Route path="/chat">
              <Chat/>
            </Route>
            <Route path="/">
              <Main/>
            </Route>
          </>
        )
        : (<Redirect to={"/"}/>)}
    </Router>
  )
}

export default App;
export {primarySocket}