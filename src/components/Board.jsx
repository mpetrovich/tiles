import { useEffect, useState } from "react"
import styled from "styled-components"
import useLocalStorageState from "use-local-storage-state"
import ReactCanvasConfetti from "react-canvas-confetti"
import Tile from "./Tile"
import Button from "./Button"
import { moveTile } from "../services/board"

export default function Board({
    board,
    rowCount,
    colCount,
    tileSize,
    image,
    loading,
    peeking,
    swapping,
    completed,
    onResetBoard,
    onMoveTile,
    darkMode,
}) {
    const [zIndex, setZIndex] = useState(-1)
    const showConfetti = () => setZIndex(2)
    const hideConfetti = () => setZIndex(-1)
    useEffect(() => (completed ? showConfetti() : hideConfetti()), [completed])

    const [statsVisible, setStatsVisible] = useState(false)
    const showStats = () => setStatsVisible(true)
    const hideStats = () => setStatsVisible(false)

    const [moveCount, setMoveCount] = useState(0)
    const [bestMoveCount, setBestMoveCount] = useLocalStorageState(`best.${swapping ? "swap" : "slide"}.${rowCount}`, {
        defaultValue: null,
    })
    const [previousBestMoveCount, setPreviousBestMoveCount] = useState(bestMoveCount)
    useEffect(() => setMoveCount(0), [rowCount, image])

    const onConfettiCompletion = () => {
        hideConfetti()
        showStats()
        setPreviousBestMoveCount(bestMoveCount)
        setBestMoveCount(Math.min(moveCount, bestMoveCount || Infinity))
    }

    const onHideStats = () => {
        hideStats()
        setMoveCount(0)
        setPreviousBestMoveCount(bestMoveCount)
        onResetBoard()
    }

    const onClickTile = (fromRow, fromCol) => {
        if (moveTile(board, fromRow, fromCol, swapping)) {
            setMoveCount(moveCount + 1)
            onMoveTile()
        }
    }

    return (
        <StyledBoard
            rowCount={rowCount}
            colCount={colCount}
            tileSize={tileSize}
            image={image}
            peeking={completed || peeking}
            darkMode={darkMode}
        >
            {loading && <div className="loading">Loading…</div>}
            <div className="tiles">
                {board.map((cols, row) =>
                    cols.map((tile, col) => (
                        <Tile
                            tile={tile}
                            row={row}
                            col={col}
                            width={tileSize}
                            height={tileSize}
                            image={image}
                            rowCount={board.length}
                            colCount={board[0].length}
                            moveCount={moveCount}
                            darkMode={darkMode}
                            key={col}
                            onClick={() => tile && onClickTile(row, col)}
                        />
                    ))
                )}
            </div>
            <ReactCanvasConfetti
                className="confetti"
                style={{ zIndex }}
                fire={completed}
                onDecay={onConfettiCompletion}
                colors={["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"]}
                decay={0.85}
                drift={0}
                gravity={1}
                origin={{
                    x: 0.5,
                    y: 0.25,
                }}
                particleCount={500}
                resize
                scalar={1}
                shapes={["circle", "square"]}
                angle={90}
                spread={360}
                startVelocity={50}
                ticks={150}
                useWorker
            />
            {statsVisible && (
                <div className="stats">
                    <div style={{ fontSize: "6rem" }} data-do-not-invert>
                        🥳
                    </div>
                    <div style={{ textAlign: "right" }}>
                        Moves made: <code>{moveCount}</code>
                        <br />
                        {previousBestMoveCount && (
                            <>
                                Previous best: <code>{previousBestMoveCount}</code>
                            </>
                        )}
                    </div>
                    <Button onClick={onHideStats} data-do-not-invert>
                        Try again
                    </Button>
                </div>
            )}
        </StyledBoard>
    )
}

const StyledBoard = styled.div`
    position: relative;
    width: ${(props) => props.colCount * props.tileSize}px;
    height: ${(props) => props.rowCount * props.tileSize}px;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        display: block;
        background: ${(props) => `url("${props.image}")`};
        background-size: 100%;
        filter: ${(props) => (props.darkMode ? "invert(1)" : "none")};
    }

    .loading {
        position: absolute;
        z-index: 2;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: #aaa;
        background: #f0f0f0;
    }

    .tiles {
        display: ${(props) => (props.peeking ? "none" : "")};
    }

    .confetti {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .stats {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px 0;
        justify-content: space-evenly;
        font-size: 3rem;
        background: rgb(255 255 255 / 90%);
        backdrop-filter: blur(5px);

        code {
            display: inline-block;
            min-width: 2ch;
        }
    }
`
