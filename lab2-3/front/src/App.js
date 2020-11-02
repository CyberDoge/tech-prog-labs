import './App.css';
import Main from "./pages/Main";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {useEffect, useState} from "react";
import primarySocket from "./utils/Socket";
import Chat from "./pages/Chat";

function App() {
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(1);
    }, 400)
  }, [])
  useEffect(() => {
    if (loaded !== 1) return;
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      primarySocket.send((data, error) => {
        localStorage.setItem("token", JSON.stringify(data))
        setLoaded(2)
      }, "reg_anonymous", null)
    } else {
      primarySocket.send((data, error) => {
        document.querySelector("body").append(JSON.stringify(data))
        setLoaded(2)
      }, "token_auth", token)
    }
  }, [loaded])
  return (
    loaded === 2 ? (
        <Router>
          <Route path="/chat">
            <Chat/>
          </Route>
          <Route path="/">
            <Main/>
          </Route>
        </Router>) :
      "loading for connection"
  );
}

export default App;
