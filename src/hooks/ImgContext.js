import { createContext } from "react";

const ImgContext = createContext({
  img: [],
  setImg: (img) => {}
});

export default ImgContext;