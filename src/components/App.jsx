import { useEffect, useState } from "react"
import styled from "styled-components"
import { Helmet } from "react-helmet"
import initReactFastclick from "react-fastclick"
import useLocalStorageState from "use-local-storage-state"
import images from "../images.json"
import ToggleButton from "./ToggleButton"
import Board from "./Board"
import { shuffleArray, shuffleBoard, newBoard, isComplete } from "../services/board"

const USE_UNSPLASH_API = true

initReactFastclick()
shuffleArray(images)

export default function App() {
    const [rowCount, setRowCount] = useState(4)
    const viewportPadding = 20
    const viewportWidth = 600 + viewportPadding
    const tileSize = (viewportWidth - viewportPadding) / rowCount

    const [image, setImage] = useState("")
    const [imageIndex, setImageIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const fetchImage = async () => {
        if (!USE_UNSPLASH_API) {
            return
        }
        setLoading(true)
        const response = await fetch("https://source.unsplash.com/random/800x800")
        setImage(response.url)
        setLoading(false)
    }
    const changeImage = () => {
        setImage("")
        fetchImage()
        setImageIndex((imageIndex + 1) % images.length)
    }
    useEffect(() => {
        fetchImage()
    }, [])
    useEffect(() => {
        if (!USE_UNSPLASH_API) {
            setImage(images[imageIndex])
        }
    }, [imageIndex])

    const colCount = rowCount
    const createBoard = () => shuffleBoard(newBoard(rowCount, colCount), Math.pow(rowCount, 5))
    const [board, setBoard] = useState(createBoard)
    const resetBoard = () => setBoard(createBoard())
    const refreshBoard = () => setBoard(board.slice())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(resetBoard, [rowCount, colCount, image])

    const completed = isComplete(board)

    const [imageQuery, setImageQuery] = useState("")
    useEffect(() => setImageQuery(encodeURIComponent(`site:unsplash.com ${image.replace(/(\?.*$)/, "")}`)), [image])

    const [peeking, setPeeking] = useState(false)
    const peek = () => setPeeking(true)
    const unpeek = () => setPeeking(false)

    const [swapping, setSwapping] = useState(true)
    const allowSwapping = () => setSwapping(true)
    const disallowSwapping = () => setSwapping(false)

    const [darkMode, setDarkMode] = useLocalStorageState("darkMode", { defaultValue: false })
    const toggleDarkMode = () => setDarkMode(!darkMode)
    useEffect(() => {
        document.documentElement.classList.toggle("darkMode", darkMode)
    }, [darkMode])

    return (
        <StyledApp rowCount={rowCount} tileSize={tileSize}>
            <Helmet>
                <meta name="viewport" content={`width=${viewportWidth}`} />
            </Helmet>
            <div className="buttons" style={{ fontSize: "2em" }}>
                <ToggleButton selected={swapping} onClick={allowSwapping}>
                    Allow swapping
                </ToggleButton>
                <ToggleButton selected={!swapping} onClick={disallowSwapping}>
                    Only sliding
                </ToggleButton>
            </div>
            <div className="buttons" style={{ fontSize: "3em" }}>
                <ToggleButton selected={rowCount === 3} onClick={() => setRowCount(3)}>
                    <span data-do-not-invert>😃</span>
                </ToggleButton>
                <ToggleButton selected={rowCount === 4} onClick={() => setRowCount(4)}>
                    <span data-do-not-invert>🤨</span>
                </ToggleButton>
                <ToggleButton selected={rowCount === 5} onClick={() => setRowCount(5)}>
                    <span data-do-not-invert>😰</span>
                </ToggleButton>
                <ToggleButton selected={rowCount === 6} onClick={() => setRowCount(6)}>
                    <span data-do-not-invert>😱</span>
                </ToggleButton>
            </div>
            <Board
                board={board}
                rowCount={rowCount}
                colCount={colCount}
                tileSize={tileSize}
                image={image}
                loading={loading}
                peeking={peeking}
                swapping={swapping}
                completed={completed}
                onResetBoard={resetBoard}
                onMoveTile={refreshBoard}
                darkMode={darkMode}
            />
            <div className="buttons" style={{ fontSize: "3em" }}>
                <ToggleButton onClick={changeImage}>
                    <span data-do-not-invert>🔄 🖼️</span>
                </ToggleButton>
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
                    <span data-do-not-invert>{peeking ? "😮" : "🫣"}</span>
                </ToggleButton>
            </div>
            <footer>
                <div className="darkMode" onClick={toggleDarkMode}>
                    <i className={darkMode ? "icon-sun icon-2x" : "icon-moon icon-2x"} />
                </div>
                <div className="imageCredit">
                    Image from{" "}
                    <a href={`https://www.google.com/search?tbm=isch&q=${imageQuery}`} target="blank">
                        Unsplash
                    </a>
                </div>
                <a className="gitHub" href="https://github.com/mpetrovich/tileslide" target="blank">
                    <i className="icon-github icon-2x" />
                </a>
            </footer>
        </StyledApp>
    )
}

const StyledApp = styled.div`
    box-sizing: border-box;
    margin: 0 auto;
    width: ${(props) => props.rowCount * props.tileSize}px;
    user-select: none;

    > * {
        margin: 10px 0;
    }

    .buttons {
        margin: 15px 0;
        display: flex;
        align-items: center;

        &:first-child {
            margin-top: 0;
        }

        > * {
            flex: 1;
        }
    }

    footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0 5px;
        color: #666;
    }

    .darkMode {
        cursor: pointer;
        width: 60px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .imageCredit {
        a,
        a:link,
        a:hover,
        a:active,
        a:visited {
            color: #666;
        }
    }

    .gitHub {
        text-decoration: none;
        color: inherit;
        width: 60px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`
