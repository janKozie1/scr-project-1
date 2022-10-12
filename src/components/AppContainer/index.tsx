import styled from "styled-components";
import { toSpacing } from "../Box";

const AppContainer = styled.div`
  display: flex;
  overflow: auto;
  padding: ${toSpacing(6)} 0 ${toSpacing(12)};
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export default AppContainer;
