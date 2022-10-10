import { createGlobalStyle } from 'styled-components'

import { ReactNode } from 'react'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: inherit;
    letter-spacing: inherit;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  body > #root {
    height: 100%;
    overflow: hidden;
  }

  body > #root {
    display: flex;
    margin-left: auto;
    margin-right: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

type Props = Readonly<{
  children: ReactNode;
}>

const StylesProvider = ({children}: Props) => {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  )
}

export default StylesProvider;
