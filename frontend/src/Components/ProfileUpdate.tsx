import { useEffect, useContext } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import StateContext from "../Contexts/StateContext";

import {
  Box,
  Button,
  //   Checkbox,
  //   FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

type State = {
  agencyNameValue: string;
  phoneNumberValue: string;
  bioValue: string;
  uploadedPicture: File[];
  profilePictureValue: File | null;
  sendRequest: number;
  openSnack: boolean;
  disabledBtn: boolean;
};

type Action =
  | { type: "catchAgencyNameChange"; agencyNameChosen: string }
  | { type: "catchPhoneNumberChange"; phoneNumberChosen: string }
  | { type: "catchBioChange"; bioChosen: string }
  | { type: "catchUploadedPicture"; pictureChosen: File[] }
  | { type: "catchProfilePictureChange"; profilePictureChosen: File | null }
  | { type: "changeSendRequest" }
  | { type: "openTheSnack" }
  | { type: "closeTheSnack" }
  | { type: "disableTheButton" }
  | { type: "allowTheButton" };

type GlobalStateType = {
  userId: string;
  userIsLogged: boolean;
  userUsername: string;
};

function ProfileUpdate(props: any) {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext) as GlobalStateType;
  console.log(props.userProfile);

  const initialState: State = {
    agencyNameValue: props.userProfile.agencyName,
    phoneNumberValue: props.userProfile.phoneNumber,
    bioValue: props.userProfile.bio,
    uploadedPicture: [],
    profilePictureValue: props.userProfile.profilePic,
    sendRequest: 0,
    openSnack: false,
    disabledBtn: false,
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchAgencyNameChange":
        draft.agencyNameValue = action.agencyNameChosen;
        break;
      case "catchPhoneNumberChange":
        draft.phoneNumberValue = action.phoneNumberChosen;
        break;
      case "catchBioChange":
        draft.bioValue = action.bioChosen;
        break;
      case "catchUploadedPicture":
        draft.uploadedPicture = action.pictureChosen;
        break;
      case "catchProfilePictureChange":
        draft.profilePictureValue = action.profilePictureChosen;
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
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  //use Effect to catch uploaded picture
  useEffect(() => {
    if (state.uploadedPicture[0]) {
      dispatch({
        type: "catchProfilePictureChange",
        profilePictureChosen: state.uploadedPicture[0],
      });
    }
  }, [state.uploadedPicture[0]]);

  // use Effect to send the request
  useEffect(() => {
    if (state.sendRequest) {
      async function updateProfile() {
        const formData = new FormData();
        if (
          typeof state.profilePictureValue === "string" ||
          state.profilePictureValue === null
        ) {
          formData.append("agency_name", state.agencyNameValue);
          formData.append("phone_number", state.phoneNumberValue);
          formData.append("bio", state.bioValue);
          formData.append("seller", GlobalState.userId);
        } else {
          formData.append("agency_name", state.agencyNameValue);
          formData.append("phone_number", state.phoneNumberValue);
          formData.append("bio", state.bioValue);
          if (state.profilePictureValue)
            formData.append("profile_picture", state.profilePictureValue);
          formData.append("seller", GlobalState.userId);
        }

        try {
          const response = await Axios.patch(
            `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/update/`,
            formData
          );
          console.log(response.data);
          dispatch({ type: "openTheSnack" });
        } catch (error) {
          const err = error as AxiosError;
          dispatch({ type: "allowTheButton" });
          console.log(err.response);
        }
      }
      updateProfile();
    }
  }, [state.sendRequest]);

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
  }

  useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate(0);
			}, 1500);
		}
	}, [state.openSnack]);

  function ProfilePictureDisplay() {
    if (typeof state.profilePictureValue !== "string") {
      return (
        <ul>
          {state.profilePictureValue ? (
            <li>{state.profilePictureValue.name}</li>
          ) : (
            ""
          )}
        </ul>
      );
    } else if (typeof state.profilePictureValue === "string") {
      return (
        <Grid container sx={{ mt: "1rem", mx: "auto" }}>
          <img
            src={props.userProfile.profilePic}
            alt="profile pic"
            style={{ height: "5rem", width: "5rem" }}
          />
        </Grid>
      );
    }
  }

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
        <form onSubmit={FormSubmit}>
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
              My Profile
            </Typography>
            <TextField
              id="agencyName"
              label="AgencyName*"
              variant="outlined"
              value={state.agencyNameValue}
              onChange={(e) =>
                dispatch({
                  type: "catchAgencyNameChange",
                  agencyNameChosen: e.target.value,
                })
              }
            />
            <TextField
              id="phoneNumber"
              label="Phone Number*"
              variant="outlined"
              value={state.phoneNumberValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPhoneNumberChange",
                  phoneNumberChosen: e.target.value,
                })
              }
            />
            <TextField
              id="bio"
              label="Bio"
              variant="outlined"
              multiline
              rows={4}
              value={state.bioValue}
              onChange={(e) =>
                dispatch({
                  type: "catchBioChange",
                  bioChosen: e.target.value,
                })
              }
            />
            <Grid container>{ProfilePictureDisplay()}</Grid>

            <Button
              variant="contained"
              component="label"
              sx={{
                width: "50%",
                mx: "auto",
                background: "#00d3e6ff",
                color: "#000",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": { background: "#00c5c8ff" },
              }}
            >
              Profile Picture
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg, image/gif"
                onChange={(e) =>
                  dispatch({
                    type: "catchUploadedPicture",
                    pictureChosen: Array.from(e.target.files || []),
                  })
                }
              />
            </Button>

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
              Update
            </Button>
          </Box>
        </form>
        <Snackbar
					open={state.openSnack}
					message="You have successfully updated your profile!"
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

export default ProfileUpdate;
