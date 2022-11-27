import styled from "styled-components"

export default function Tile(props) {
    return <StyledTile {...props}>{props.tile === null && props.moveCount ? props.moveCount : ""}</StyledTile>
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
    background-color: ${(props) => (props.darkMode ? "#000" : "#fff")};
    background-image: ${(props) => (props.tile !== null ? `url("${props.image}")` : "none")};
    background-origin: border-box;
    background-size: ${(props) => `${props.colCount * props.width}px ${props.rowCount * props.height}px`};
    background-position-x: -${(props) => (props.tile % props.colCount) * props.width}px;
    background-position-y: -${(props) => Math.floor(props.tile / props.colCount) * props.height}px;
    border: 1px solid transparent;
    border-color: ${(props) => (props.darkMode ? "#000" : "#fff")};
    font-size: 2rem;
    font-weight: bold;
    color: #ccc;
    cursor: ${(props) => (props.tile !== null ? "pointer" : "default")};
    user-select: none;
    touch-action: manipulation;
    filter: ${(props) => (props.darkMode ? "invert(1)" : "none")};
`
