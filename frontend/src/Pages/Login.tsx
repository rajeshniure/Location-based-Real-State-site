import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import { AxiosError } from "axios";
import { useEffect, useContext } from "react";

//Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

type State = {
  usernameValue: string;
  passwordValue: string;
  sendRequest: number;
  token: string;
};

type Action =
  | { type: "catchUsernameChange"; usernameChosen: string }
  | { type: "catchPasswordChange"; passwordChosen: string }
  | { type: "changeSendRequest" }
  | { type: "catchToken"; tokenValue: string };

function Login() {
  const navigate = useNavigate();

  const GlobalDispatch = useContext(DispatchContext);
  const GlobalState = useContext(StateContext);

  if (!GlobalDispatch || !GlobalState) {
  throw new Error("Global context is not available");
}

  const initialState: State = {
    usernameValue: "",
    passwordValue: "",
    sendRequest: 0,
    token: "",
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        break;

      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        break;

      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;

      case "catchToken":
        draft.token = action.tokenValue;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("form is submitted! ");
    dispatch({ type: "changeSendRequest" });
  }

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      async function LogIn() {
        try {
          const response = await Axios.post(
            "http://127.0.0.1:8000/api-auth-djoser/token/login/",
            {
              username: state.usernameValue,
              password: state.passwordValue,
            },
            { cancelToken: source.token }
          );
          console.log(response.data);
          dispatch({
            type: "catchToken",
            tokenValue: response.data.auth_token,
          });
          if (GlobalDispatch) {
            GlobalDispatch({
              type: "catchToken",
              tokenValue: response.data.auth_token,
            });
          }

          // navigate('/')
        } catch (error) {
          const err = error as AxiosError;
          console.log(err.response);
        }
      }
      LogIn();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  // get user info
  useEffect(() => {
    if (state.token !== "") {
      const source = Axios.CancelToken.source();
      async function GetUserInfo() {
        try {
          const response = await Axios.get(
            "http://127.0.0.1:8000/api-auth-djoser/users/me/",
            {
              headers: {
                Authorization: `Token ${state.token}`,
              },
              cancelToken: source.token,
            }
          );
          console.log(response.data);
          if (GlobalDispatch) {
          GlobalDispatch({
            type: "userSignsIn",
            usernameInfo: response.data.username,
            emailInfo: response.data.email,
            IdInfo: response.data.id,
          });
        }
          navigate("/");
        } catch (error) {
          const err = error as AxiosError;
          console.log(err.response);
        }
      }
      GetUserInfo();
      return () => {
        source.cancel();
      };
    }
  }, [state.token]);

  return (
    <>
      <Box
        sx={{
          width: "400px",
          margin: "25px auto",
          border: "3px solid #EBAF70",
          borderRadius: "16px",
        }}
      >
        <form action="" onSubmit={FormSubmit}>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              margin: "0px auto ",
              padding: "20px",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              sx={{ fontWeight: "600" }}
            >
              Login
            </Typography>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              value={state.usernameValue}
              onChange={(e) =>
                dispatch({
                  type: "catchUsernameChange",
                  usernameChosen: e.target.value,
                })
              }
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              value={state.passwordValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPasswordChange",
                  passwordChosen: e.target.value,
                })
              }
            />

            <Button
              variant="contained"
              type="submit"
              sx={{
                width: "50%",
                mx: "auto",
                background: "#00e676",
                color: "#000",
                borderRadius: "16px",
                textTransform: "none",
                "&:hover": { background: "#00c853" },
              }}
            >
              Login
            </Button>
          </Box>
        </form>

        <Typography
          variant="body1"
          textAlign="center"
          sx={{ fontWeight: "600", pb: 2 }}
        >
          Don't have an account yet?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#00e676", cursor: "pointer" }}
          >
            Sign Up{" "}
          </span>
        </Typography>
      </Box>
    </>
  );
}

export default Login;
