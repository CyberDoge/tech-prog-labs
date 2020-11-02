import {Button, Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import primarySocket from "../utils/Socket";
import React, {useEffect, useState} from "react";

const Chat = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessage] = useState([]);
  useEffect(() => {
    primarySocket.chatMessageHandler = (message) => setMessage([...messages, message])
  }, [])
  const sendMessage = () => {
    primarySocket.sendChatMessage((res, error) => {
      setMessage([...messages, error || res.data]);
    }, {data: messageText})
  }
  return (
    <Grid container direction={"column"} justify={"center"} alignContent={"center"}>
      <Grid style={{marginTop: 40}} xs={7} spacing={2} container direction={"column"} item>
        {messages.map((message) => (
            <Grid item key={message}>
              {message}
            </Grid>
          )
        )}
      </Grid>
      <Grid item spacing={3} container>
        <Grid xs={9} item>
          <TextField fullWidth value={messageText} onChange={e => setMessageText(e.target.value)}/>
        </Grid>
        <Grid xs={3} item>
          <Button onClick={sendMessage} variant={"contained"}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Chat;