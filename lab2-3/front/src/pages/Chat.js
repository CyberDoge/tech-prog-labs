import {Grid} from "@material-ui/core";
import React from "react";
import Board from "./Board";

const Chat = () => {
  return (
    <Grid container direction={"column"} justify={"center"} alignContent={"center"}>
      <Grid style={{marginTop: 40}} xs={7} spacing={2} container direction={"column"} item>
        <Board/>
      </Grid>
    </Grid>
  )
}

export default Chat;