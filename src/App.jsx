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

    return (
        <StyledBoard style={{ width: cols * tileWidth, height: rows * tileHeight }}>
            {board.map((cols, row) =>
                cols.map((tile, col) => (
                    <Tile tile={tile} row={row} col={col} width={tileWidth} height={tileHeight} key={col} />
                ))
            )}
        </StyledBoard>
    )
}

function initBoard(rows, cols) {
    const board = new Array(rows)
        .fill(null)
        .map((_, row) => new Array(cols).fill(null).map((_, col) => 1 + row * cols + col))
    board[rows - 1][cols - 1] = null
    return board
}

const StyledBoard = styled.div`
    position: relative;
    user-select: none;
`

function Tile({ tile, row, col, width, height }) {
    return (
        <StyledTile tile={tile} row={row} col={col} width={width} height={height}>
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
    background: ${(props) => (props.tile ? "#ccf" : "#f0f0f0")};
    border: 1px solid #000;
    cursor: ${(props) => (props.tile ? "pointer" : "default")};
`
