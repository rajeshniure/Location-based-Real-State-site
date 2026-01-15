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
            return( 
            <Button disabled size="small">
              No Properties
            </Button>
            );
         
          }
          else if (state.userProfile.sellerListings.length === 1){
            return( 
            <Button size="small" onClick={()=>navigate(`/agencies/${state.userProfile.sellerId}`)}>
              One property listed
            </Button>
          );
        }
        else{
          return( 
            <Button size="small" onClick={()=>navigate(`/agencies/${state.userProfile.sellerId}`)}>
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
              src={state.userProfile.profilePic !== null ? state.userProfile.profilePic : defaultProfilePicture}
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
                You have {PropertiesDisplay()}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
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
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

  return (
    <>
      <Box>{WelcomeDisplay()}</Box>
      <ProfileUpdate userProfile={state.userProfile} />
    </>
  );
}

export default Profile;
