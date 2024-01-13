import './Memory.css'
import { useEffect, useState } from "react"

const TILE_COLORS = ["red", "green", "blue", "yellow"]

export default function Memory() {
  const [firstSelected, setFirstSelected] = useState<number | null>(null)
  const [secondSelected, setSecondSelected] = useState<number | null>(null)
  const [tiles, setTiles] = useState<string[]>([]);
  const [matchedTiles, setMatchedTiles] = useState<boolean[]>(Array<boolean>(8).fill(false))
  const [isSelectable, setIsSelectable] = useState<boolean>(true)

  useEffect(() => {
    setTiles(shuffle([...TILE_COLORS, ...TILE_COLORS]))
  }, [])

  useEffect(() => {
    if (firstSelected != null && secondSelected != null) {
      if (tiles[firstSelected] === tiles[secondSelected]) {
        const newSelectedTiles = [...matchedTiles]
        newSelectedTiles[firstSelected] = true
        newSelectedTiles[secondSelected] = true

        setMatchedTiles(newSelectedTiles)
        setFirstSelected(null)
        setSecondSelected(null)
      } else {
        setIsSelectable(false)

        const timer = setTimeout(() => {
          setIsSelectable(true)
          setFirstSelected(null)
          setSecondSelected(null)
        }, 1000)

        return () => {
          if (timer) clearTimeout(timer)
        }
      }
    }
  }, [firstSelected, secondSelected])

  const handleClick = (index: number) => {
    console.log(`tile clicked ${index}`)
    if (!isSelectable || matchedTiles[index]) return

    if (firstSelected == null) {
      setFirstSelected(index)
    } else {
      setSecondSelected(index)
    }
  }

  const restartGame = () => {
    setMatchedTiles(Array<boolean>(8).fill(false))
    setTiles(shuffle([...TILE_COLORS, ...TILE_COLORS]))
    setFirstSelected(null)
    setSecondSelected(null)
  }

  const won = matchedTiles.every(tile => tile)

  return (
    <>
      {won ? (
        <h1>You Win!</h1>
      ) : (
        <h1>Memory</h1>
      )}
      <div className="board">
        {tiles.map((color: string, index: number) => {
          const shouldBeSelected = firstSelected === index || secondSelected === index || matchedTiles[index]

          return <div
            key={index}
            className={`tile ${shouldBeSelected ? color : ''}`.trim()}
            onClick={() => handleClick(index)}>
          </div>
        })}
      </div>
      {won ? (
        <button onClick={restartGame}>Restart</button>
      ) : null}
    </>
  )
}

function shuffle(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the elements at i and randomIndex
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}
