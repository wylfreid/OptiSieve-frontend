import { createContext } from "react";

const ResultContext = createContext({
  result: [],
  setResult: (result) => {}
});

export default ResultContext;