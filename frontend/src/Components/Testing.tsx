// import { useReducer } from "react";
import { useImmerReducer } from "use-immer";

type State = {
  appleCount: number;
  bananaCount: number;
  message: string;
  happy: boolean;
};

type Action =
  | { type: "addApple" }
  | {
      type: "changeEverything";
      customMessage: string;
    };

function Testing() {
  const initialState: State = {
    appleCount: 1,
    bananaCount: 10,
    message: "Hello",
    happy: false,
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "addApple":
        draft.appleCount = draft.appleCount + 1;
        break;
      case "changeEverything":
        draft.bananaCount = draft.bananaCount + 10;
        draft.message = action.customMessage;
        draft.happy = true;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  return (
    <>
      <div>Right now the count of apple is: {state.appleCount}</div>
      <div>Right now the count of banana is: {state.bananaCount}</div>
      <div>Right now the message is: {state.message}</div>
      {state.happy ? <h1>ohh You are happy</h1> : <h1>Why are you sad!</h1>}
      <br />
      <button onClick={() => dispatch({ type: "addApple" })}>Add Apple</button>
      <button
        onClick={() =>
          dispatch({
            type: "changeEverything",
            customMessage: "This message is commig from the dispatch",
          })
        }
      >
        Change EveryThing
      </button>
    </>
  );
}

export default Testing;


"thamel"
  "lazimpat"
  "naxal"
  "baluwatar"
  "maharajgunj"
  "new-road"
  "durbarmarg"
  "putalisadak"
  "tripureshwor"

  "budhanilkantha"
  "boudha"
  "kapan"
  "tokha"
  "dhapasi"
  "kalanki"
  "syuchatar"
  "kirtipur"
  "balaju"
  "samakhushi"
  "chabahil"