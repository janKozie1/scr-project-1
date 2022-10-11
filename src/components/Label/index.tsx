import styled from "styled-components";
import { toSpacing } from "../Box";

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${toSpacing(2)};
`

export default Label;
