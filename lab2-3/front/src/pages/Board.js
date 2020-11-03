import React, {useState} from "react";
import Square from "./Square";
import Horse from "./Horse";

const Board = () => {
  const [selectedHorseId, setSelectedHorseId] = useState(null);
  const [shadowHorses, setShadowHorses] = useState([...new Array(8).keys()].map((index) => ({
    x: 1 - Math.floor(index * 2 / 8) + (index * 2) % 8,
    y: Math.floor((index * 2) / 8),
    id: `${index}horse`
  })));

  const [shadowEnemyHorses, setShadowEnemyHorses] = useState([...new Array(8).keys()].map((index) => ({
    x: Math.floor(index * 2 / 8) + (index * 2) % 8,
    y: 7 - Math.floor(index * 2 / 8),
    id: `${index}enemy`
  })));
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
      <Square available={selectedHorseId && isSquareAvailable(index % 8, Math.floor(index / 8))} key={index} id={index}
              black={(index + Math.floor(index / 8)) % 2} x={index % 8} y={Math.floor(index / 8)}
              handleClick={(x, y) => () => {
                setShadowHorses(shadowHorses.map(horse => {
                  if (selectedHorseId === horse.id) {
                    return {...horse, x, y}
                  } else {
                    return {...horse};
                  }
                }))
                setSelectedHorseId(null)
              }}/>
    ))
  }
  const selectHorse = (horseId) => () => {
    setSelectedHorseId(horseId)
  }

  const kill = (horseId) => () => {
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
      setSelectedHorseId(null);
    }
  }
  return (<div id={"foo"}>
    {mapSquare()}
    {shadowHorses.map((horse) => <Horse onClick={selectHorse} {...horse} key={horse.id}
                                        selected={selectedHorseId === hrse.id}/>)}
    {shadowEnemyHorses.map((horse) => <Horse {...horse} key={horse.id} enemy onClick={kill}/>)}
  </div>)
}

export default Board;