import { Box, Button, Snackbar, TextField, Typography, Alert, Paper, Container } from "@mui/material";
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
          minHeight: "calc(100vh - 65px)",
          backgroundColor: "#252932",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
			        width: "80%",
              borderRadius: "24px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(235, 175, 112, 0.2)",
            }}
          >
            <Box
              sx={{
                background: "rgba(208, 189, 168, 0.1)",
                py: 2,
                px: 2,
                textAlign: "center",
                borderBottom: "1px solid rgba(235, 175, 112, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "700",
                  color: "#EBAF70",
                  fontSize: { xs: "1.75rem", md: "2rem" },
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mt: 1,
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Sign in to continue to Ghar Sewa
              </Typography>
            </Box>

            <form action="" onSubmit={FormSubmit}>
              <Box
                display="flex"
                flexDirection="column"
                gap={3}
                sx={{
                  padding: { xs: 3, md: 2 },
                }}
              >
                {state.serverError ? (
                  <Alert 
                    severity="error"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    Incorrect username or password!
                  </Alert>
                ) : null}

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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(235, 175, 112, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#EBAF70",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#EBAF70",
                    },
                  }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(235, 175, 112, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#EBAF70",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#EBAF70",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    width: "100%",
                    mt: 2,
                    background: "#00e676",
                    color: "#000",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    py: 1.5,
                    "&:hover": { 
                      background: "#00c853",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0, 230, 118, 0.4)",
                    },
                    "&:disabled": {
                      background: "rgba(0, 230, 118, 0.5)",
                      color: "rgba(0, 0, 0, 0.5)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  disabled={state.disabledBtn}
                >
                  Login
                </Button>
              </Box>
            </form>

            <Box
              sx={{
                padding: { xs: 2, md: 3 },
                pt: 0,
                textAlign: "center",
                borderTop: "1px solid rgba(235, 175, 112, 0.1)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Don't have an account yet?{" "}
                <span
                  onClick={() => navigate("/register")}
                  style={{
                    color: "#00e676",
                    cursor: "pointer",
                    fontWeight: "600",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Sign Up
                </span>
              </Typography>
            </Box>
          </Paper>
        </Container>
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
