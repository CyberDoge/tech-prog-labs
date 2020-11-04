import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  horse: {
    backgroundColor: ({selected}) => selected ? "blue" : "transparent",
    "&&:hover": {
      backgroundColor: "blue"
    }
  }
}))
const Horse = ({x, y, id, enemy, selected, onClick}) => {
  const classes = useStyles({selected});
  return (
    <div onClick={onClick && onClick(id)} className={classes.horse} id={`${id}`} style={{
      color: enemy ? "red" : "black",
      position: "absolute",
      width: 64,
      height: 64,
      left: x * 64,
      top: y * 64,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      fontSize: 46,
      fontWeight: "bold"
    }}>
      ♘
    </div>)
}

export default Horse;