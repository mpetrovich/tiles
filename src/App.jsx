import { useEffect, useCallback, useState } from "react"
import styled from "styled-components"
import { Helmet } from "react-helmet"
import initReactFastclick from "react-fastclick"
import ReactCanvasConfetti from "react-canvas-confetti"

initReactFastclick()

export default function App() {
    const [rowCount, setRowCount] = useState(4)
    const viewportWidth = 600
    const imageUrlBase = "https://source.unsplash.com/random/800x800?"
    const tileSize = viewportWidth / rowCount

    const [image, setImage] = useState(imageUrlBase)
    const changeImage = () => setImage(imageUrlBase + Math.floor(Math.random() * 100))

    const [peeking, setPeeking] = useState(false)
    const peek = () => setPeeking(true)
    const unpeek = () => setPeeking(false)

    return (
        <StyledApp rowCount={rowCount} tileSize={tileSize}>
            <Helmet>
                <meta name="viewport" content={`width=${viewportWidth}`} />
            </Helmet>
            <div className="buttons">
                <ToggleButton selected={rowCount === 3} onClick={() => setRowCount(3)}>
                    😃
                </ToggleButton>
                <ToggleButton selected={rowCount === 4} onClick={() => setRowCount(4)}>
                    🤨
                </ToggleButton>
                <ToggleButton selected={rowCount === 5} onClick={() => setRowCount(5)}>
                    😰
                </ToggleButton>
                <ToggleButton selected={rowCount === 6} onClick={() => setRowCount(6)}>
                    🤯
                </ToggleButton>
            </div>
            <Board rowCount={rowCount} tileSize={tileSize} image={image} peeking={peeking} />
            <div className="buttons">
                <ToggleButton
                    style={{ minWidth: "200px" }}
                    selected={peeking}
                    onTouchStart={peek}
                    onTouchEnd={unpeek}
                    onMouseDown={peek}
                    onMouseUp={unpeek}
                    onPointerDown={peek}
                    onPointerUp={unpeek}
                >
                    🫣
                </ToggleButton>
                <ToggleButton onClick={changeImage}>🔄 🖼️</ToggleButton>
            </div>
        </StyledApp>
    )
}

const StyledApp = styled.div`
    box-sizing: border-box;
    width: ${(props) => props.rowCount * props.tileSize}px;

    > * {
        margin: 10px 0;
    }

    .buttons {
        margin: 20px 10px;
        display: flex;
        align-items: center;
        > * {
            flex: 1;
        }
    }
`

const ToggleButton = styled.button`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 5rem;
    font-size: 2rem;
    background: ${(props) => (props.selected ? "#333" : "#f0f0f0")};
    color: ${(props) => (props.selected ? "#fff" : "#333")};
    border: 1px solid ${(props) => (props.selected ? "#333" : "#ccc")};
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;

    &:active {
        background: #333;
        border-color: #333;
    }

    & + & {
        border-left: none;
    }

    &:first-of-type {
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
    }
    &:last-of-type {
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
    }
`

function Board({ rowCount, tileSize, image, peeking }) {
    const colCount = rowCount
    const createBoard = useCallback(
        () => shuffleBoard(newBoard(rowCount, colCount), Math.pow(rowCount, 5)),
        [rowCount, colCount]
    )
    const [board, setBoard] = useState(createBoard)
    useEffect(() => setBoard(createBoard()), [createBoard])

    const completed = isComplete(board)

    const [zIndex, setZIndex] = useState(-1)
    const showConfetti = () => setZIndex(2)
    const hideConfetti = () => setZIndex(-1)
    useEffect(() => (completed ? showConfetti() : hideConfetti()), [completed])

    const onClickTile = (fromRow, fromCol) => {
        if (moveTile(board, fromRow, fromCol)) {
            setBoard(board.slice())
        }
    }

    return (
        <StyledBoard
            rowCount={rowCount}
            colCount={colCount}
            tileSize={tileSize}
            image={image}
            peeking={completed || peeking}
        >
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
                            key={col}
                            onClick={() => onClickTile(row, col)}
                        />
                    ))
                )}
            </div>
            <ReactCanvasConfetti
                style={{ zIndex }}
                fire={completed}
                onDecay={hideConfetti}
                angle={90}
                className="confetti"
                colors={["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"]}
                decay={0.8}
                drift={0}
                gravity={0.5}
                origin={{
                    x: 0.5,
                    y: 0.5,
                }}
                particleCount={500}
                resize
                scalar={1}
                shapes={["circle", "square"]}
                spread={360}
                startVelocity={45}
                ticks={100}
                useWorker
            />
        </StyledBoard>
    )
}

function newBoard(rowCount, colCount) {
    const board = new Array(rowCount)
        .fill(null)
        .map((_, row) => new Array(colCount).fill(null).map((_, col) => row * colCount + col))
    board[rowCount - 1][colCount - 1] = null
    return board
}

function shuffleBoard(board, steps) {
    let prev = []
    while (steps-- > 0) {
        let [row, col] = findEmptySpace(board)
        const destinations = shuffleArray([
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1],
        ])
        for (let [fromRow, fromCol] of destinations) {
            if (fromRow === prev[0]?.[0] && fromCol === prev[0]?.[1]) {
                // Avoids back-and-forth movement
                continue
            }
            if (moveTile(board, fromRow, fromCol)) {
                prev.push([fromRow, fromCol])
                if (prev.length > 2) {
                    prev.shift()
                }
                break
            }
        }
    }
    return board.slice()
}

function findEmptySpace(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === null) {
                return [row, col]
            }
        }
    }
    return [null, null]
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function moveTile(board, fromRow, fromCol) {
    if (fromRow < 0 || fromRow >= board.length || fromCol < 0 || fromCol >= board.length) {
        return false
    }

    const [toRow, toCol] = findAdjacentSpace(board, fromRow, fromCol)
    if (toRow !== null && toCol !== null) {
        board[toRow][toCol] = board[fromRow][fromCol]
        board[fromRow][fromCol] = null
        return true
    }
    return false
}

function findAdjacentSpace(board, row, col) {
    if (isSpaceFree(board, row - 1, col)) {
        return [row - 1, col]
    }
    if (isSpaceFree(board, row + 1, col)) {
        return [row + 1, col]
    }
    if (isSpaceFree(board, row, col - 1)) {
        return [row, col - 1]
    }
    if (isSpaceFree(board, row, col + 1)) {
        return [row, col + 1]
    }
    return [null, null]
}

function isSpaceFree(board, row, col) {
    return 0 <= row && row < board.length && 0 <= col && col < board[row].length && board[row][col] === null
}

function isComplete(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (row === board.length - 1 && col === board[row].length - 1) {
                continue
            }
            if (board[row][col] !== row * board[row].length + col) {
                return false
            }
        }
    }
    return true
}

const StyledBoard = styled.div`
    position: relative;
    width: ${(props) => props.colCount * props.tileSize}px;
    height: ${(props) => props.rowCount * props.tileSize}px;
    background: ${(props) => `url("${props.image}")`};
    background-size: 100%;

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
`

function Tile(props) {
    return <StyledTile {...props} />
}

const StyledTile = styled.div`
    position: absolute;
    box-sizing: border-box;
    left: ${(props) => props.col * props.width}px;
    top: ${(props) => props.row * props.height}px;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    background-image: ${(props) => (props.tile !== null ? `url("${props.image}")` : "none")};
    background-origin: border-box;
    background-size: ${(props) => `${props.colCount * props.width}px ${props.rowCount * props.height}px`};
    background-position-x: -${(props) => (props.tile % props.colCount) * props.width}px;
    background-position-y: -${(props) => Math.floor(props.tile / props.colCount) * props.height}px;
    border: 1px solid #fff;
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 2px #000;
    cursor: ${(props) => (props.tile !== null ? "pointer" : "default")};
    user-select: none;
`
