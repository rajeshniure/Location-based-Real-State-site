import { useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type State = {
  usernameValue: string;
  emailValue: string;
  passwordValue: string;
  password2Value: string;
  sendRequest: number;
};

type Action =
  | { type: "catchUsernameChange"; usernameChosen: string }
  | { type: "catchEmailChange"; emailChosen: string }
  | { type: "catchPasswordChange"; passwordChosen: string }
  | { type: "catchPassword2Change"; password2Chosen: string }
  | { type: "changeSendRequest" };

function Register() {
  const navigate = useNavigate();

  const initialState: State = {
    usernameValue: "",
    emailValue: "",
    passwordValue: "",
    password2Value: "",
    sendRequest: 0,
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        break;
      case "catchEmailChange":
        draft.emailValue = action.emailChosen;
        break;
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        break;
      case "catchPassword2Change":
        draft.password2Value = action.password2Chosen;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
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
      async function SignUp() {
        try {
          const response = await Axios.post(
            "http://127.0.0.1:8000/api-auth-djoser/users/ ",
            {
              username: state.usernameValue,
              email: state.emailValue,
              password: state.passwordValue,
              re_password: state.password2Value,
            },
            { cancelToken: source.token }
          );
          console.log(response.data);
          navigate('/')
        } catch (error) {
          const err = error as AxiosError;
          console.log(err.response);
        }
      }
      SignUp();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

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
              Create an account
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
              id="email"
              label="Email"
              variant="outlined"
              value={state.emailValue}
              onChange={(e) =>
                dispatch({
                  type: "catchEmailChange",
                  emailChosen: e.target.value,
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
            <TextField
              id="password2"
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={state.password2Value}
              onChange={(e) =>
                dispatch({
                  type: "catchPassword2Change",
                  password2Chosen: e.target.value,
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
              Sign Up
            </Button>
          </Box>
        </form>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ fontWeight: "600", pb: 2 }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#00e676", cursor: "pointer" }}
          >
            Sign In{" "}
          </span>
        </Typography>
      </Box>
    </>
  );
}

export default Register;
