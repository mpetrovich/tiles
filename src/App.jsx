import { useEffect, useCallback, useState } from "react"
import styled from "styled-components"
import { Helmet } from "react-helmet"
import initReactFastclick from "react-fastclick"

initReactFastclick()

export default function App() {
    const [rowCount, setRowCount] = useState(4)
    const viewportWidth = 600
    const tileSize = viewportWidth / rowCount
    const image = "https://source.unsplash.com/random/800x800"

    return (
        <StyledApp rowCount={rowCount} tileSize={tileSize}>
            <Helmet>
                <meta name="viewport" content={`width=${viewportWidth}`} />
            </Helmet>
            <div className="buttons">
                <Button type="button" selected={rowCount === 4} onClick={() => setRowCount(4)}>
                    Easy
                </Button>
                <Button type="button" selected={rowCount === 5} onClick={() => setRowCount(5)}>
                    Medium
                </Button>
                <Button type="button" selected={rowCount === 6} onClick={() => setRowCount(6)}>
                    Hard
                </Button>
            </div>
            <Board rowCount={rowCount} tileSize={tileSize} image={image} />
        </StyledApp>
    )
}

const StyledApp = styled.div`
    width: ${(props) => props.rowCount * props.tileSize}px;

    .buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
    }
`

const Button = styled.button`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 10ch;
    height: 30px;
    font-size: 16px;
    cursor: pointer;
`

function Board({ rowCount, tileSize, image }) {
    const colCount = rowCount
    const createBoard = useCallback(
        () => shuffleBoard(newBoard(rowCount, colCount), Math.pow(rowCount, 5)),
        [rowCount, colCount]
    )
    const [board, setBoard] = useState(createBoard)
    const completed = isComplete(board)

    useEffect(() => setBoard(createBoard()), [createBoard])

    const onClickTile = (fromRow, fromCol) => {
        if (moveTile(board, fromRow, fromCol)) {
            setBoard(board.slice())
        }
    }

    return (
        <StyledBoard
            image={image}
            completed={completed}
            style={{ width: colCount * tileSize, height: rowCount * tileSize }}
        >
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
                        completed={completed}
                        key={col}
                        onClick={() => onClickTile(row, col)}
                    />
                ))
            )}
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
    background-color: #fff;
    background-image: ${(props) => (props.tile !== null ? `url("${props.image}")` : "none")};
    background-origin: border-box;
    background-size: ${(props) => `${props.colCount * props.width}px ${props.rowCount * props.height}px`};
    background-position-x: -${(props) => (props.tile % props.colCount) * props.width}px;
    background-position-y: -${(props) => Math.floor(props.tile / props.colCount) * props.height}px;
    border: ${(props) => (props.tile !== null && !props.completed ? "1px solid #fff" : "none")};
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 2px #000;
    cursor: ${(props) => (props.tile !== null ? "pointer" : "default")};
    opacity: ${(props) => (props.completed ? 0 : 1)};
    user-select: none;
`
