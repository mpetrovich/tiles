export function newBoard(rowCount, colCount) {
    const board = new Array(rowCount)
        .fill(null)
        .map((_, row) => new Array(colCount).fill(null).map((_, col) => row * colCount + col))
    board[rowCount - 1][colCount - 1] = null
    return board
}

export function shuffleBoard(board, steps) {
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

export function findEmptySpace(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === null) {
                return [row, col]
            }
        }
    }
    return [null, null]
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

export function moveTile(board, fromRow, fromCol, swapping) {
    if (fromRow < 0 || fromRow >= board.length || fromCol < 0 || fromCol >= board.length) {
        return false
    }

    if (swapping) {
        const [toRow, toCol] = findEmptySpace(board)
        board[toRow][toCol] = board[fromRow][fromCol]
        board[fromRow][fromCol] = null
        return true
    }

    const [toRow, toCol] = findAdjacentSpace(board, fromRow, fromCol)
    if (toRow !== null && toCol !== null) {
        board[toRow][toCol] = board[fromRow][fromCol]
        board[fromRow][fromCol] = null
        return true
    }
    return false
}

export function findAdjacentSpace(board, row, col) {
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

export function isSpaceFree(board, row, col) {
    return 0 <= row && row < board.length && 0 <= col && col < board[row].length && board[row][col] === null
}

export function isComplete(board) {
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
