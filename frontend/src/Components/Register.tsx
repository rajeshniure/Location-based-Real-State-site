import { useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { Box, Button, Snackbar, TextField, Typography, Alert, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

type State = {
  usernameValue: string;
  emailValue: string;
  passwordValue: string;
  password2Value: string;
  sendRequest: number;
  openSnack: boolean;
  disabledBtn: boolean;
  usernameErrors: {
    hasErrors: boolean;
    errorMessage: string;
  };
  emailErrors: {
    hasErrors: boolean;
    errorMessage: string;
  };
  passwordErrors: {
    hasErrors: boolean;
    errorMessage: string;
  };
  password2HelperText: string;
  serverMessageUsername: string;
  serverMessageEmail: string;
  serverMessageSimilarPassword: string;
  serverMessageCommonPassword: string;
  serverMessageNumericPassword: string;
}; 

type Action =
  | { type: "catchUsernameChange"; usernameChosen: string }
  | { type: "catchEmailChange"; emailChosen: string }
  | { type: "catchPasswordChange"; passwordChosen: string }
  | { type: "catchPassword2Change"; password2Chosen: string }
  | { type: "changeSendRequest" }
  | { type: "openTheSnack" }
  | { type: "closeTheSnack" }
  | { type: "disableTheButton" }
  | { type: "allowTheButton" }
  | { type: "catchUsernameErrors"; usernameChosen: string }
  | { type: "catchEmailErrors"; emailChosen: string }
  | { type: "catchPasswordErrors"; passwordChosen: string }
  | { type: "usernameExists" }
  | { type: "emailExists" }
  | { type: "similarPassword" }
  | { type: "commonPassword" }
  | { type: "numericPassword" };

function Register() {
  const navigate = useNavigate();

  const initialState: State = {
    usernameValue: "",
    emailValue: "",
    passwordValue: "",
    password2Value: "",
    sendRequest: 0,
    openSnack: false,
		disabledBtn: false,
		usernameErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		emailErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		passwordErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		password2HelperText: "",
		serverMessageUsername: "",
		serverMessageEmail: "",
		serverMessageSimilarPassword: "",
		serverMessageCommonPassword: "",
		serverMessageNumericPassword: "",
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
			case "catchUsernameChange":
				draft.usernameValue = action.usernameChosen;
				draft.usernameErrors.hasErrors = false;
				draft.usernameErrors.errorMessage = "";
				draft.serverMessageUsername = "";
				break;
			case "catchEmailChange":
				draft.emailValue = action.emailChosen;
				draft.emailErrors.hasErrors = false;
				draft.emailErrors.errorMessage = "";
				draft.serverMessageEmail = "";
				break;
			case "catchPasswordChange":
				draft.passwordValue = action.passwordChosen;
				draft.passwordErrors.hasErrors = false;
				draft.passwordErrors.errorMessage = "";
				draft.serverMessageSimilarPassword = "";
				draft.serverMessageCommonPassword = "";
				draft.serverMessageNumericPassword = "";
				break;
			case "catchPassword2Change":
				draft.password2Value = action.password2Chosen;
				if (action.password2Chosen !== draft.passwordValue) {
					draft.password2HelperText = "The passwords must match";
				} else if (action.password2Chosen === draft.passwordValue) {
					draft.password2HelperText = "";
				}
				break;
			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
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

			case "catchUsernameErrors":
				if (action.usernameChosen.length === 0) {
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage = "This field must not be empty";
				} else if (action.usernameChosen.length < 5) {
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage =
						"The username must have at least five characters";
				} else if (!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)) {
					draft.usernameErrors.hasErrors = true;
					draft.usernameErrors.errorMessage =
						"This field must not have special characters";
				}
				break;

			case "catchEmailErrors":
				if (
					!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
						action.emailChosen
					)
				) {
					draft.emailErrors.hasErrors = true;
					draft.emailErrors.errorMessage = "Please enter a valid email!";
				}
				break;

			case "catchPasswordErrors":
				if (action.passwordChosen.length < 8) {
					draft.passwordErrors.hasErrors = true;
					draft.passwordErrors.errorMessage =
						"The password must at least have 8 characters!";
				}
				break;

			case "usernameExists":
				draft.serverMessageUsername = "This username already exists!";
				break;

			case "emailExists":
				draft.serverMessageEmail = "This email already exists!";
				break;

			case "similarPassword":
				draft.serverMessageSimilarPassword =
					"The password is too similar to the username!";
				break;

			case "commonPassword":
				draft.serverMessageCommonPassword = "The password is too common!";
				break;

			case "numericPassword":
				draft.serverMessageNumericPassword =
					"The password must not only contain numbers!";
				break;
		}
	}

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
			!state.usernameErrors.hasErrors &&
			!state.emailErrors.hasErrors &&
			!state.passwordErrors.hasErrors &&
			state.password2HelperText === ""
		) {
			dispatch({ type: "changeSendRequest" });
			dispatch({ type: "disableTheButton" });
		}
	}
  

  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      async function SignUp() {
        try {
          await Axios.post(
            "http://127.0.0.1:8000/api-auth-djoser/users/ ",
            {
              username: state.usernameValue,
              email: state.emailValue,
              password: state.passwordValue,
              re_password: state.password2Value,
            },
            { cancelToken: source.token }
          );
          dispatch({ type: "openTheSnack" });
				} catch (error) {
					dispatch({ type: "allowTheButton" });

					if (Axios.isAxiosError(error) && error.response?.data) {
						const errorData = error.response.data as {
							username?: string[];
							email?: string[];
							password?: string[];
						};

						if (errorData.username) {
							dispatch({ type: "usernameExists" });
						} else if (errorData.email) {
							dispatch({ type: "emailExists" });
						} else if (
							errorData.password &&
							errorData.password[0] ===
							"The password is too similar to the username."
						) {
							dispatch({ type: "similarPassword" });
						} else if (
							errorData.password &&
							errorData.password[0] === "This password is too common."
						) {
							dispatch({ type: "commonPassword" });
						} else if (
							errorData.password &&
							errorData.password[0] ===
							"This password is entirely numeric."
						) {
							dispatch({ type: "numericPassword" });
						}
					}
				}
			}
      SignUp();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [state.openSnack, navigate]);

  return (
    <>
      <Box
        sx={{
          minHeight: "calc(100vh - 65px)",
          backgroundColor: "#252932",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 4, md: 0 },
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
                Create an Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Join Live Better and start your property journey
              </Typography>
            </Box>

            <form action="" onSubmit={FormSubmit}>
              <Box
                display="flex"
                flexDirection="column"
                gap={2.5}
                sx={{
                  padding: { xs: 3, md: 2 },
                }}
              >
                {state.serverMessageUsername ? (
                  <Alert 
                    severity="error"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    {state.serverMessageUsername}
                  </Alert>
                ) : null}

                {state.serverMessageEmail ? (
                  <Alert 
                    severity="error"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    {state.serverMessageEmail}
                  </Alert>
                ) : null}

                {state.serverMessageSimilarPassword ? (
                  <Alert 
                    severity="error"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    {state.serverMessageSimilarPassword}
                  </Alert>
                ) : null}

                {state.serverMessageCommonPassword ? (
                  <Alert 
                    severity="error"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    {state.serverMessageCommonPassword}
                  </Alert>
                ) : null}

                {state.serverMessageNumericPassword ? (
                  <Alert 
                    severity="error"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                    }}
                  >
                    {state.serverMessageNumericPassword}
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
                  onBlur={(e) =>
                    dispatch({
                      type: "catchUsernameErrors",
                      usernameChosen: e.target.value,
                    })
                  }
                  error={state.usernameErrors.hasErrors ? true : false}
                  helperText={state.usernameErrors.errorMessage}
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
                    "& .MuiFormHelperText-root": {
                      color: "rgba(255, 255, 255, 0.6)",
                    },
                  }}
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
                  onBlur={(e) =>
                    dispatch({
                      type: "catchEmailErrors",
                      emailChosen: e.target.value,
                    })
                  }
                  error={state.emailErrors.hasErrors ? true : false}
                  helperText={state.emailErrors.errorMessage}
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
                    "& .MuiFormHelperText-root": {
                      color: "rgba(255, 255, 255, 0.6)",
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
                  onBlur={(e) =>
                    dispatch({
                      type: "catchPasswordErrors",
                      passwordChosen: e.target.value,
                    })
                  }
                  error={state.passwordErrors.hasErrors ? true : false}
                  helperText={state.passwordErrors.errorMessage}
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
                    "& .MuiFormHelperText-root": {
                      color: "rgba(255, 255, 255, 0.6)",
                    },
                  }}
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
                  helperText={state.password2HelperText}
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
                    "& .MuiFormHelperText-root": {
                      color: "rgba(255, 255, 255, 0.6)",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  disabled={state.disabledBtn}
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
                >
                  Sign Up
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
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#00e676",
                    cursor: "pointer",
                    fontWeight: "600",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Sign In
                </span>
              </Typography>
            </Box>
          </Paper>
        </Container>
        <Snackbar
          open={state.openSnack}
          message="You have successfully created an account!"
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

export default Register;
