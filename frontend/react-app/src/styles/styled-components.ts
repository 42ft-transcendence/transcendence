import "styled-components";
import { ColorsTypes } from "./Theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorsTypes;
  }
}
