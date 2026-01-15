import { useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import {  useParams } from "react-router-dom";
// import StateContext from "../Contexts/StateContext";
import defaultProfilePicture from "../assets/defaultProfilePicture.jpg";

import {
  Box,
  CircularProgress,
  // Button,
  Grid,
  Typography,
  IconButton,
  CardActions,
  CardContent,
  CardMedia,
  Card,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

type Listing = {
  id: number;
  title: string;
  description: string;
  picture1: string | null;
  listing_type: string;
  property_status: "sale" | "rent";
  price: number;
  rental_frequency?: string;
};

type State = {
  userProfile: {
    agencyName: string;
    phoneNumber: string;
    profilePic: string;
    bio: string;
    sellerListings: Listing[];
  };
  dataIsLoading: boolean;
};

type Action =
  | { type: "catchUserProfileInfo"; profileObject: any }
  | { type: "loadingDone" };

// type GlobalStateType = {
//   userId: string;
//   userIsLogged: boolean;
//   userUsername: string;
// };

function AgencyDetail() {
  //   const navigate = useNavigate();
  // const GlobalState = useContext(StateContext) as GlobalStateType;

  const params = useParams();

  const initialState: State = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
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
          `http://127.0.0.1:8000/api/profiles/${params.id}/`
        );
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response);
      }
    }
    GetProfileInfo();
  }, []);

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
    <div>
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
            src={
              state.userProfile.profilePic !== null
                ? state.userProfile.profilePic
                : defaultProfilePicture
            }
            alt=""
          />
        </Grid>
        <Grid size={6} direction={"column"} justifyContent={"center"}>
          <Grid>
            <Typography variant="h5" sx={{ textAlign: "center", mt: "1rem" }}>
              <span style={{ color: "green", fontWeight: "bolder" }}>
                {state.userProfile.agencyName}
              </span>
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="h5" sx={{ textAlign: "center", mt: "1rem" }}>
              <IconButton>
                <PhoneIcon /> {state.userProfile.phoneNumber}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        <Grid sx={{ mt: "1rem", p: "5px" }}>{state.userProfile.bio}</Grid>
      </Grid>

      <Grid
        container
        justifyContent="flex-start"
        spacing={2}
        sx={{ p: "10px" }}
      >
        {state.userProfile.sellerListings.map((listing) => {
          return (
            <Grid key={listing.id} sx={{ mt: "1rem", maxWidth: "20rem" }}>
              <Card>
                <CardMedia
                  sx={{ height: 140 }}
                  image={
                    `http://localhost:8000${listing.picture1}`
                      ? `http://localhost:8000${listing.picture1}`
                      : defaultProfilePicture
                  }
                  title="Listing Picture"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {listing.description.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  {listing.property_status === "sale"
                    ? `${listing.listing_type}: $${listing.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    : `${listing.listing_type}: $${listing.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                        listing.rental_frequency
                      }`}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default AgencyDetail;
