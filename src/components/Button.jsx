import styled from "styled-components"

export default function Button({ selected, children, ...others }) {
    return (
        <StyledButton selected={selected} {...others}>
            {children}
        </StyledButton>
    )
}

const StyledButton = styled.button`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6em 1em;
    font-size: inherit;
    background: #208cff;
    color: #fff;
    border: 1px solid ${(props) => (props.selected ? "#333" : "#ccc")};
    border-radius: 0.5em;
    cursor: pointer;
    user-select: none;
    touch-action: manipulation;
    outline: none;

    &:active {
        background: #333;
        border-color: #333;
    }
`
