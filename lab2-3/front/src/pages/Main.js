import {Button, Grid, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {primarySocket} from "../App";

const useStyle = makeStyles({})

const Main = () => {
  const classes = useStyle();
  const [themes, setThemes] = useState([]);
  const history = useHistory();
  primarySocket.startChatHandler = (youStart) => {
    history.push(`/chat?${youStart ? "youStart=true" : ""}`);
  }
  const getThemes = () => primarySocket.send((data) => {
    setThemes(data.themes)
  }, "get_themes", {from: 0, count: 229});
  useEffect(() => {
    getThemes();
  }, [])
  const createTheme = () => {
    primarySocket.send(data => {
      getThemes();
    }, "create_theme", {title: (new Date().getTime() + Math.random()).toString()})
  }
  const accept = (themeId, agree) => (e) => {
    primarySocket.send(data => {
      console.log(data)
    }, "vote_to_theme", {themeId, agree})
  }
  return (
    <Grid className={classes.container} justify={"center"} direction={"column"} spacing={5} alignItems={"center"}
          container>
      {themes.map((theme) => (
        <Grid key={theme.title} item justify={"center"} spacing={3} alignItems={"center"} alignContent={"center"}
              container>
          <Grid item>
            <Typography>{theme.title}</Typography>
          </Grid>
          <Grid item>
            <Button color={"primary"} variant={"contained"} onClick={accept(theme.id, true)}>black</Button>
          </Grid>
          <Grid item>
            <Button variant={"contained"} onClick={accept(theme.id, false)}>white</Button>
          </Grid>
        </Grid>
      ))}
      {!themes.length &&
      <Grid item>
        <Typography>no games</Typography>
      </Grid>
      }
      <Grid item>
        <Button onClick={createTheme}>create new</Button>
      </Grid>
    </Grid>
  )
}
export default Main;