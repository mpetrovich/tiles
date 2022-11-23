import { useState } from "react"
import styled from "styled-components"

import zebra from "./images/frida-lannerstrom-c_cPNXlovvY-unsplash.jpg"

export default function App() {
    return (
        <StyledApp>
            <Board rows={2} cols={2} />
            <Board rows={3} cols={3} />
            <Board rows={4} cols={4} />
            <Board rows={6} cols={4} />
            <Board rows={4} cols={6} />
        </StyledApp>
    )
}

const StyledApp = styled.div`
    padding: 10px;

    > * {
        margin: 20px;
    }
`

function Board({ rows, cols }) {
    const [board, setBoard] = useState(() => initBoard(rows, cols))
    const [image, setImage] = useState(zebra)
    const tileWidth = 100
    const tileHeight = 100
    const completed = isComplete(board)

    console.log(board)

    const moveTile = (fromRow, fromCol) => {
        const [toRow, toCol] = findAdjacentSpace(board, fromRow, fromCol)
        if (toRow !== null) {
            board[toRow][toCol] = board[fromRow][fromCol]
            board[fromRow][fromCol] = null
            setBoard(board.slice())
        }
    }

    return (
        <StyledBoard image={image} completed={completed} style={{ width: cols * tileWidth, height: rows * tileHeight }}>
            {board.map((cols, row) =>
                cols.map((tile, col) => (
                    <Tile
                        tile={tile}
                        row={row}
                        col={col}
                        width={tileWidth}
                        height={tileHeight}
                        image={image}
                        numRows={board.length}
                        numCols={board[0].length}
                        completed={completed}
                        key={col}
                        onClick={() => moveTile(row, col)}
                    />
                ))
            )}
        </StyledBoard>
    )
}

function initBoard(rows, cols) {
    const board = new Array(rows)
        .fill(null)
        .map((_, row) => new Array(cols).fill(null).map((_, col) => row * cols + col))
    board[rows - 1][cols - 1] = null
    return board
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
    return 0 <= row && row < board.length && 0 <= col && col < board[0].length && board[row][col] === null
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
    user-select: none;
    background: ${(props) => `url("${props.image}")`};
    background-size: 100%;
`

function Tile(props) {
    return <StyledTile {...props}>{props.tile}</StyledTile>
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
    background-color: #f0f0f0;
    background-image: ${(props) => (props.tile !== null ? `url("${props.image}")` : "none")};
    background-origin: border-box;
    background-size: ${(props) => `${props.numCols * props.width}px ${props.numRows * props.height}px`};
    background-position-x: -${(props) => (props.tile % props.numCols) * props.width}px;
    background-position-y: -${(props) => Math.floor(props.tile / props.numCols) * props.height}px;
    border: ${(props) => (props.tile !== null && !props.completed ? "2px solid #f0f0f0" : "none")};
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 2px #000;
    cursor: ${(props) => (props.tile !== null ? "pointer" : "default")};
    opacity: ${(props) => (props.completed ? 0 : 1)};
`
