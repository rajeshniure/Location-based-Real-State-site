import { useEffect, useContext } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
// import { useNavigate } from "react-router-dom";

import StateContext from "../Contexts/StateContext";

import {
  Box,
  Button,
//   Checkbox,
//   FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

type State = {
  userProfile: {
    agencyName: string;
    phoneNumber: string;
    profilePic: string;
    bio: string;
  };
  agencyNameValue: string;
  phoneNumberValue: string;
  bioValue: string;
  uploadedPicture: File[];
  profilePictureValue: File | null;
  sendRequest: number;
};

type Action =
  | { type: "catchUserProfileInfo"; profileObject: any }
  | { type: "catchAgencyNameChange"; agencyNameChosen: string }
  | { type: "catchPhoneNumberChange"; phoneNumberChosen: string }
  | { type: "catchBioChange"; bioChosen: string }
  | { type: "catchUploadedPicture"; pictureChosen: File[] }
  | { type: "catchProfilePictureChange"; profilePictureChosen: File | null }
  | { type: "changeSendRequest" };

type GlobalStateType = {
  userId: string;
  userIsLogged: boolean;
  userUsername: string;
};

function Profile() {
  //   const navigate = useNavigate();
  const GlobalState = useContext(StateContext) as GlobalStateType;

  const initialState: State = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
    },
    agencyNameValue: "",
    phoneNumberValue: "",
    bioValue: "",
    uploadedPicture: [],
    profilePictureValue: null,
    sendRequest: 0,
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;

        break;

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

  //request to get profile info
  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/`
        );
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response);
      }
    }
    GetProfileInfo();
  }, []);

  // use Effect to send the request
  useEffect(() => {
    if (state.sendRequest) {
      async function updateProfile() {
        const formData = new FormData();
        formData.append("agency_name", state.agencyNameValue);
        formData.append("phone_number", state.phoneNumberValue);
        formData.append("bio", state.bioValue);
        if (state.profilePictureValue)
        formData.append("profile_picture", state.profilePictureValue);
        formData.append("seller", GlobalState.userId);

        try {
          const response = await Axios.patch(
            `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/update/`,
            formData
          );
          console.log(response.data);
          //   navigate("/listings");
        } catch (error) {
          const err = error as AxiosError;
          console.log(err.response);
        }
      }
      updateProfile();
    }
  }, [state.sendRequest]);

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
  }

  function WelcomeDisplay() {
    if (
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === "" ||
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === ""
    ) {
      return (
        <Typography variant="h5" sx={{ textAlign: "center", mt: "1rem" }}>
          Welcome{" "}
          <span style={{ color: "green", fontWeight: "bolder" }}>
            {GlobalState.userUsername}
          </span>{" "}
          , please submit this form below to update the profile
        </Typography>
      );
    } else {
      return (
        <Grid
          container
          sx={{
            width: "50%",
            mx: "auto",
            border: "5px solid black",
            mt: "1rem",
            p: "5px",
          }}
        >
          <Grid size={6}>
            <img
              style={{ height: "10rem", width: "15rem" }}
              src={state.userProfile.profilePic}
              alt=""
            />
          </Grid>
          <Grid size={6} direction={"column"} justifyContent={"center"}>
            <Grid>
              <Typography variant="h5" sx={{ textAlign: "center", mt: "1rem" }}>
                Welcome{" "}
                <span style={{ color: "green", fontWeight: "bolder" }}>
                  {GlobalState.userUsername}
                </span>
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h5" sx={{ textAlign: "center", mt: "1rem" }}>
                You have x property listed
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  return (
    <>
      <Box>{WelcomeDisplay()}</Box>
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
              Proile Picture
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
            <Grid container>
              <ul>
                {state.profilePictureValue ? (
                  <li>{state.profilePictureValue.name}</li>
                ) : (
                  ""
                )}
              </ul>
            </Grid>

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
              Update
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default Profile;
