import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  square: {
    "&&:hover": {
      backgroundColor: "green!important"
    }
  }
}))
const Square = ({available, black, x, y, id, handleClick}) => {
  const classes = useStyles()
  return <div className={classes.square} style={{
    backgroundColor: available ? "yellow" : black ? "#5e5252" : "#f4f4f4",
    position: "absolute",
    width: 64,
    height: 64,
    left: x * 64,
    top: y * 64
  }}
              id={id}
              onClick={available ? handleClick(x, y, id) : () => {
              }}
  />
}
export default Square;