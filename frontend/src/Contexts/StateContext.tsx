import { createContext } from "react";
import { type State } from "../AppRoutes" ;


const StateContext = createContext<State | null>(null);

export default StateContext;
