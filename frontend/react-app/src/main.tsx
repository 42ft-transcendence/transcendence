import ReactDOM from "react-dom/client";
import Router from "./router";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Theme } from "./styles/Theme";
import GlobalStyle from "./styles/GlobalStyle";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <RouterProvider router={Router} />
    </ThemeProvider>
  </RecoilRoot>,
);
