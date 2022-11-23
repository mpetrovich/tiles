import { useState } from "react"
import styled from "styled-components"

export default function App() {
    return (
        <StyledApp>
            <Board />
        </StyledApp>
    )
}

const StyledApp = styled.div``

function Board() {
    const rows = 4
    const cols = 4
    const [board, setBoard] = useState(() => initBoard(rows, cols))
    const tileWidth = 100
    const tileHeight = 100

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
        <StyledBoard complete={isComplete(board)} style={{ width: cols * tileWidth, height: rows * tileHeight }}>
            {board.map((cols, row) =>
                cols.map((tile, col) => (
                    <Tile
                        tile={tile}
                        row={row}
                        col={col}
                        width={tileWidth}
                        height={tileHeight}
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
    outline: ${(props) => (props.complete ? "3px solid green" : "none")};
`

function Tile({ tile, row, col, width, height, ...props }) {
    return (
        <StyledTile tile={tile} row={row} col={col} width={width} height={height} {...props}>
            {tile}
        </StyledTile>
    )
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
    background-color: ${(props) => (props.tile !== null ? "#ccf" : "#f0f0f0")};
    border: 1px solid #000;
    cursor: ${(props) => (props.tile !== null ? "pointer" : "default")};
`
