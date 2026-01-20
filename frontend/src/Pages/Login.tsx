import { Box, Button, Snackbar, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import { useEffect, useContext } from "react";

//Contexts
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

type State = {
  usernameValue: string;
  passwordValue: string;
  sendRequest: number;
  token: string;
  openSnack: boolean;
  disabledBtn: boolean;
  serverError: boolean;
};

type Action =
  | { type: "catchUsernameChange"; usernameChosen: string }
  | { type: "catchPasswordChange"; passwordChosen: string }
  | { type: "changeSendRequest" }
  | { type: "catchToken"; tokenValue: string }
  | { type: "openTheSnack" }
  | { type: "closeTheSnack" }
  | { type: "disableTheButton" }
  | { type: "allowTheButton" }
  | { type: "catchServerError" };

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
    openSnack: false,
    disabledBtn: false,
    serverError: false,
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.serverError = false;
        break;

      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        draft.serverError = false;
        break;

      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;

      case "catchToken":
        draft.token = action.tokenValue;
        break;

      case "openTheSnack":
        draft.openSnack = true;
        break;

      case "closeTheSnack":
        draft.openSnack = false;
        break;

      case "disableTheButton":
        draft.disabledBtn = true;
        break;

      case "allowTheButton":
        draft.disabledBtn = false;
        break;

      case "catchServerError":
        draft.serverError = true;
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
            { cancelToken: source.token },
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
          dispatch({ type: "allowTheButton" });
          dispatch({ type: "catchServerError" });
          console.error("Login error:", error);
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
            },
          );
          if (GlobalDispatch) {
            GlobalDispatch({
              type: "userSignsIn",
              usernameInfo: response.data.username,
              emailInfo: response.data.email,
              IdInfo: response.data.id,
            });
          }

          dispatch({ type: "openTheSnack" });
        } catch (error) {
          console.error("Get user info error:", error);
        }
      }
      GetUserInfo();
      return () => {
        source.cancel();
      };
    }
  }, [state.token]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [state.openSnack]);

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

            {state.serverError ? (
              <Alert severity="error">Incorrect username or password!</Alert>
            ) : (
              ""
            )}

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
              error={state.serverError ? true : false}
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
              error={state.serverError ? true : false}
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
              disabled={state.disabledBtn}
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
        <Snackbar
          open={state.openSnack}
          message="You have successfully logged in"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          autoHideDuration={3000}
          onClose={() => dispatch({ type: "closeTheSnack" })}
        />
      </Box>
    </>
  );
}

export default Login;
