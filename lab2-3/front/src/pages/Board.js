import React, {useEffect, useState} from "react";
import Square from "./Square";
import Horse from "./Horse";
import {primarySocket} from "../App";
import {useHistory, useLocation} from "react-router";

const Board = () => {
  let query = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const [turn, setTurn] = useState(false);
  const [selectedHorseId, setSelectedHorseId] = useState(null);
  const [shadowHorses, setShadowHorses] = useState([]);
  const [shadowEnemyHorses, setShadowEnemyHorses] = useState([]);
  useEffect(() => {
    primarySocket.chatMessageHandler = (message) => {
      const enemyHorse = JSON.parse(message);
      setShadowHorses(shadowHorses.filter(h => !(h.x === enemyHorse.x && h.y === enemyHorse.y)))
      setShadowEnemyHorses(shadowEnemyHorses.slice().map(h => {
        if (h.id === enemyHorse.id) {
          return enemyHorse;
        } else {
          return {...h}
        }
      }))
    }
    if (shadowHorses.length < 5 && shadowHorses.length !== 0) {
      alert("i loose");
      primarySocket.sendChatMessage((res, error) => {
      }, {data: "loose"})
      history.push("/");
    }
  }, [shadowEnemyHorses, shadowHorses])
  useEffect(() => {
    primarySocket.notYourTurnHandler = () => {
    }
    primarySocket.turnHandler = (turn) => {
      setTurn(turn);
    }
  }, [])
  useEffect(() => {
    const first = [...new Array(8).keys()].map((index) => ({
      x: 1 - Math.floor(index * 2 / 8) + (index * 2) % 8,
      y: Math.floor((index * 2) / 8),
      id: `${index}`
    }))
    const second = [...new Array(8).keys()].map((index) => ({
      x: Math.floor(index * 2 / 8) + (index * 2) % 8,
      y: 7 - Math.floor(index * 2 / 8),
      id: `${8 + index}`
    }))
    if (query.get("youStart")) {
      setShadowHorses(first);
      setShadowEnemyHorses(second);
    } else {
      setShadowHorses(second);
      setShadowEnemyHorses(first);
    }
  }, [query.get("youStart")])


  const sendHorse = (horse) => {
    primarySocket.sendChatMessage((res, error) => {
    }, {data: JSON.stringify(horse)})
  }
  const isSquareAvailable = (toX, toY) => {
    const {x, y} = shadowHorses.find(h => selectedHorseId === h.id);
    const dx = toX - x
    const dy = toY - y
    if (shadowHorses.some(horse => horse.x === toX && horse.y === toY)) {
      return false
    }
    return (
      (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
      (Math.abs(dx) === 1 && Math.abs(dy) === 2)
    )
  }
  const mapSquare = () => {
    return [...new Array(64).keys()].map(index => (
      <Square available={selectedHorseId && isSquareAvailable(index % 8, Math.floor(index / 8))} key={`${index}Square`}
              id={index}
              black={(index + Math.floor(index / 8)) % 2} x={index % 8} y={Math.floor(index / 8)}
              handleClick={(x, y) => () => {
                setShadowHorses(shadowHorses.map(horse => {
                  if (selectedHorseId === horse.id) {
                    return {...horse, x, y}
                  } else {
                    return {...horse};
                  }
                }))
                sendHorse({id: selectedHorseId, x, y})
                setSelectedHorseId(null)
              }}/>
    ))
  }
  const selectHorse = (horseId) => () => {
    turn && setSelectedHorseId(horseId)
  }

  const kill = (horseId) => () => {
    if (!selectedHorseId) {
      return;
    }
    const horse = shadowEnemyHorses.find(h => h.id === horseId);
    if (isSquareAvailable(horse.x, horse.y)) {
      setShadowEnemyHorses(shadowEnemyHorses.slice().filter(h => h !== horse))
      setShadowHorses(shadowHorses.slice().map(h => {
        if (h.id === selectedHorseId) {
          return {...h, x: horse.x, y: horse.y}
        } else {
          return {...h}
        }
      }))
      sendHorse({id: selectedHorseId, x: horse.x, y: horse.y})
      setSelectedHorseId(null);
      if (shadowEnemyHorses.length === 5 && shadowEnemyHorses.length !== 0) {
        alert("i win")
        history.push("/");
      }
    }
  }
  return (<div>
    {mapSquare()}
    {shadowHorses.map((horse) => <Horse onClick={selectHorse} {...horse} key={horse.id}
                                        selected={selectedHorseId === horse.id}/>)}
    {shadowEnemyHorses.map((horse) => <Horse {...horse} key={horse.id} enemy onClick={kill}/>)}
  </div>)
}

export default Board;