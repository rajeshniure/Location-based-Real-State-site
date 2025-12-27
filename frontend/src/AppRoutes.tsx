import { useImmerReducer } from "use-immer";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Listings from "./Pages/Listings";
import Agencies from "./Pages/Agencies";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import Testing from "./Components/Testing";
import Register from "./Components/Register";

import DispatchContext from "./Contexts/DispatchContext";
import StateContext from "./Contexts/StateContext";

import { useEffect } from "react";


export type State = {
  userUsername: string;
  userEmail: string;
  userId: string;
  userToken: string;
  userIsLogged: boolean;
};


export type Action =
  | {
      type: "catchToken";
      tokenValue: string;
    }
  | {
      type: "userSignsIn";
      usernameInfo: string;
      emailInfo: string;
      IdInfo: string;
    };


const AppRoutes = () => {
   
  const initialState:State = {
      userUsername: localStorage.getItem("theUserUsername")|| "",
      userEmail:localStorage.getItem("theUserEmail")|| "",
      userId:localStorage.getItem("theUserId")|| "",
      userToken:localStorage.getItem("theUserToken")|| "",
      userIsLogged: localStorage.getItem("theUserToken") ? true : false,   
    };
 
  
    function ReducerFunction(draft:State, action:Action) {
      switch (action.type) {
        case "catchToken":
          draft.userToken = action.tokenValue;
          break;
        case "userSignsIn":
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.IdInfo;
        draft.userIsLogged = true;
        break;

  
      }
    }
  
    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);
  
    useEffect(() => {
      if (state.userIsLogged) {
        localStorage.setItem("theUserUsername", state.userUsername);
        localStorage.setItem("theUserEmail", state.userEmail);
        localStorage.setItem("theUserId", state.userId);
        localStorage.setItem("theUserToken", state.userToken);
      } else {
        localStorage.removeItem("theUserUsername");
      }
    }, [state.userIsLogged]);


  return (
    <StateContext.Provider value = {state}>
    <DispatchContext.Provider value={dispatch}>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/agencies" element={<Agencies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/testing" element={<Testing />} />
      </Routes>
    </BrowserRouter>
    </DispatchContext.Provider>
    </StateContext.Provider>

  );
}


export default AppRoutes;