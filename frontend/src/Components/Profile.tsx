import { useEffect, useContext } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import { useNavigate, } from "react-router-dom";
import ProfileUpdate from "./ProfileUpdate";
import StateContext from "../Contexts/StateContext";
import defaultProfilePicture from "../assets/defaultProfilePicture.jpg";

import {
  Box,
  CircularProgress,
  Button,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
} from "@mui/material";

type State = {
  userProfile: {
    agencyName: string;
    phoneNumber: string;
    profilePic: string;
    bio: string;
    sellerId: string;
    sellerListings :[];
  };
  dataIsLoading:boolean

};

type Action =
  | { type: "catchUserProfileInfo"; profileObject: any }
  | { type: "loadingDone" };


type GlobalStateType = {
  userId: string;
  userIsLogged: boolean;
  userUsername: string;
};

function Profile() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext) as GlobalStateType;

  const initialState: State = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerId: "",
      sellerListings:[],
    },
    dataIsLoading:true,

  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        draft.userProfile.sellerId = action.profileObject.seller;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);


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
        dispatch({type:"loadingDone"})
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response);
      }
    }
    GetProfileInfo();
  }, []);


  function PropertiesDisplay() {
    if (state.userProfile.sellerListings.length === 0) {
      return (
        <Button
          disabled
          size="small"
          sx={{
            color: "rgba(255, 255, 255, 0.5)",
            textTransform: "none",
          }}
        >
          No Properties
        </Button>
      );
    } else if (state.userProfile.sellerListings.length === 1) {
      return (
        <Button
          size="small"
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          sx={{
            color: "#EBAF70",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(235, 175, 112, 0.1)",
            },
          }}
        >
          One property listed
        </Button>
      );
    } else {
      return (
        <Button
          size="small"
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
          sx={{
            color: "#EBAF70",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(235, 175, 112, 0.1)",
            },
          }}
        >
          {state.userProfile.sellerListings.length} properties listed
        </Button>
      );
    }
  }


  function WelcomeDisplay() {
    if (
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === "" ||
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === ""
    ) {
      return (
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            color: "white",
            mb: 3,
          }}
        >
          Welcome{" "}
          <span style={{ color: "#EBAF70", fontWeight: "bolder" }}>
            {GlobalState.userUsername}
          </span>
          , please submit this form below to update the profile
        </Typography>
      );
    } else {
      return (
        <Card
          elevation={8}
          sx={{
            mx: "auto",
            mb: 3,
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(235, 175, 112, 0.2)",
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                  component="img"
                  src={
                    state.userProfile.profilePic !== null
                      ? state.userProfile.profilePic
                      : defaultProfilePicture
                  }
                  alt="Profile"
                  sx={{
                    height: "10rem",
                    width: "10rem",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #EBAF70",
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: { xs: "center", md: "left" },
                    color: "white",
                    mb: 1,
                  }}
                >
                  Welcome{" "}
                  <span style={{ color: "#EBAF70", fontWeight: "bolder" }}>
                    {GlobalState.userUsername}
                  </span>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: { xs: "center", md: "left" },
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  You have {PropertiesDisplay()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    }
  }

  if (state.dataIsLoading === true) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#252932",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={60}
            sx={{
              color: "#EBAF70",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 500,
            }}
          >
            Loading Profile...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#252932",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        {WelcomeDisplay()}
        <ProfileUpdate userProfile={state.userProfile} />
      </Container>
    </Box>
  );
}

export default Profile;
