import { createContext } from "react";
import {type Action } from "../AppRoutes" ;


const DispatchContext = createContext<React.Dispatch<Action> | null>(null);

export default DispatchContext;
