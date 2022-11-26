import styled from "styled-components"

export default function ToggleButton({ selected, children, ...others }) {
    return (
        <StyledToggleButton selected={selected} {...others}>
            {children}
        </StyledToggleButton>
    )
}

const StyledToggleButton = styled.button`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 6rem;
    font-size: inherit;
    background: ${(props) => (props.selected ? "#333" : "#f0f0f0")};
    color: ${(props) => (props.selected ? "#fff" : "#000")};
    border: 1px solid ${(props) => (props.selected ? "#333" : "#ccc")};
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    outline: none;

    &:active {
        background: #333;
        border-color: #333;
    }

    & + & {
        border-left: none;
    }

    &:first-of-type {
        border-top-left-radius: 0.5em;
        border-bottom-left-radius: 0.5em;
    }
    &:last-of-type {
        border-top-right-radius: 0.5em;
        border-bottom-right-radius: 0.5em;
    }
`
