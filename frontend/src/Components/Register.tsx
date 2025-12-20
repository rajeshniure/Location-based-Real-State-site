import { useEffect, useState } from "react";
import Axios from "axios";
import { AxiosError } from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [sendRequest, setSendRequest] = useState<boolean>(false);
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [password2Value, setPassword2Value] = useState<string>("");


  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("form is submitted! ");
    setSendRequest(!sendRequest);
  }

  useEffect(() => {
    if (sendRequest) {
      const source = Axios.CancelToken.source();
      async function SignUp() {
        try {
          const response = await Axios.post(
            "http://127.0.0.1:8000/api-auth-djoser/users/ ",
            {
              username: usernameValue,
              email: emailValue,
              password: passwordValue,
              re_password: password2Value,
            },
            { cancelToken: source.token }
          );
          console.log(response.data);
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
  }, [sendRequest]);

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
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            <TextField
              id="password2"
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={password2Value}
              onChange={(e) => setPassword2Value(e.target.value)}
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
