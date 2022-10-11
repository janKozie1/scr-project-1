import styled from "styled-components";

const RowFade = styled.div`
  width: 100%;
  position: relative;

  &::before, &::after {
    position: absolute;
    z-index: 1;
    width: 5%;
    height: 150%;
    top: 50%;
    transform: translateY(-50%);
    content: '';
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, white 70%, rgba(255,255,255, 0));
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, white 70%, rgba(255,255,255, 0));
  }
`

export default RowFade;
