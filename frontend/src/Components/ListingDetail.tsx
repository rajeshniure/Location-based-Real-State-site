import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StateContext from "../Contexts/StateContext";

import defaultProfilePicture from "../assets/defaultProfilePicture.jpg";
import stadiumIconPng from "../assets/Mapicons/stadium.png";
import hospitalIconPng from "../assets/Mapicons/hospital.png";
import universityIconPng from "../assets/Mapicons/university.png";

import ListingUpdate from "../Components/ListingUpdate";

import {
  Grid,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link,
  Dialog,
  Snackbar,
  Box,
} from "@mui/material";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

import PhoneIcon from "@mui/icons-material/Phone";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import RoomIcon from "@mui/icons-material/Room";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export interface ListingInfo {
  id?: number;
  title: string;
  picture1: string;
  picture2: string;
  picture3: string;
  picture4: string;
  picture5: string;
  listing_type: "House" | "Apartment" | "Office";
  location: {
    coordinates: [number, number];
  };
  date_posted: string;
  borough: string;
  description: string;
  price: number;
  property_status: "Rent" | "Sale";
  rental_frequency?: "Day" | "Week" | "Month" | null;
  latitude: number;
  longitude: number;
  seller_username: string;
  seller_agency_name: string;
  rooms: number;
  furnished: boolean;
  cctv: boolean;
  pool: boolean;
  elevator: boolean;
  parking: boolean;
  seller: string;
  listing_pois_within_10km: any;
}

type State = {
  dataIsLoading: boolean;
  openSnack: boolean;
  disabledBtn: boolean;
  listingInfo: ListingInfo;
  sellerProfileInfo: {
    profile_picture: string;
    agency_name: string;
    seller: string;
    phone_number: string;
  };
};

type Action =
  | { type: "catchListingInfo"; listingObject: any }
  | { type: "catchSellerProfileInfo"; profileObject: any }
  | { type: "loadingDone" }
  | { type: "openTheSnack" }
  | { type: "closeTheSnack" }
  | { type: "disableTheButton" }
  | { type: "allowTheButton" };

type GlobalStateType = {
  userId: string;
};

function ListingDetails() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext) as GlobalStateType;

  const params = useParams();

  const stadiumIcon = new Icon({
    iconUrl: stadiumIconPng,
    iconSize: [40, 40],
  });

  const hospitalIcon = new Icon({
    iconUrl: hospitalIconPng,
    iconSize: [40, 40],
  });

  const universityIcon = new Icon({
    iconUrl: universityIconPng,
    iconSize: [40, 40],
  });

  const initialState: State = {
    dataIsLoading: true,
    openSnack: false,
    disabledBtn: false,
    listingInfo: {
      picture1: "",
      picture2: "",
      picture3: "",
      picture4: "",
      picture5: "",
      title: "",
      listing_type: "House",
      location: {
        coordinates: [0, 0],
      },
      date_posted: "",
      borough: "",
      description: "",
      price: 0,
      property_status: "Sale",
      rental_frequency: null,
      latitude: 0,
      longitude: 0,
      rooms: 0,
      furnished: false,
      cctv: false,
      pool: false,
      elevator: false,
      parking: false,
      seller: "",
      seller_username: "",
      seller_agency_name: "",
      listing_pois_within_10km: [],
    },
    sellerProfileInfo: {
      profile_picture: "",
      agency_name: "",
      seller: "",
      phone_number: "",
    },
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchListingInfo":
        draft.listingInfo = action.listingObject;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;

      case "catchSellerProfileInfo":
        draft.sellerProfileInfo = action.profileObject;
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

  //request to get profile info
  useEffect(() => {
    async function GetListingInfo() {
      try {
        const response = await Axios.get(
          `http://127.0.0.1:8000/api/listings/${params.id}/`,
        );
        console.log(response.data);
        dispatch({
          type: "catchListingInfo",
          listingObject: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response);
      }
    }
    GetListingInfo();
  }, []);

  // request to get profile info
  useEffect(() => {
    if (state.listingInfo) {
      async function GetProfileInfo() {
        try {
          const response = await Axios.get(
            `https://127.0.0.1:8000/api/profiles/${state.listingInfo.seller}/`,
          );

          dispatch({
            type: "catchSellerProfileInfo",
            profileObject: response.data,
          });
          dispatch({ type: "loadingDone" });
        } catch (e) {}
      }
      GetProfileInfo();
    }
  }, [state.listingInfo]);

  const listingPictures = [
    state.listingInfo.picture1,
    state.listingInfo.picture2,
    state.listingInfo.picture3,
    state.listingInfo.picture4,
    state.listingInfo.picture5,
  ].filter((picture) => picture !== null);

  const [currentPicture, setCurrentPicture] = useState(0);

  function NextPicture() {
    if (currentPicture === listingPictures.length - 1) {
      return setCurrentPicture(0);
    } else {
      return setCurrentPicture(currentPicture + 1);
    }
  }
  function PreviousPicture() {
    if (currentPicture === 0) {
      return setCurrentPicture(listingPictures.length - 1);
    } else {
      return setCurrentPicture(currentPicture - 1);
    }
  }
  const date = new Date(state.listingInfo.date_posted);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    }
  }, [state.openSnack]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function DeleteHandler() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?",
    );
    if (confirmDelete) {
      try {
        await Axios.delete(
          `https://127.0.0.1:8000/api/listings/${params.id}/delete/`,
        );

        dispatch({ type: "openTheSnack" });
        dispatch({ type: "disableTheButton" });
      } catch (e) {
        dispatch({ type: "allowTheButton" });
      }
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
    <Box sx={{ mx: "2rem", mb: "2rem" }}>
      <Grid sx={{ mt: "1rem" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/listings")}
            sx={{ cursor: "pointer" }}
          >
            Listings
          </Link>

          <Typography sx={{ color: "text.primary" }}>
            {state.listingInfo.title}
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Image Slider */}
      {listingPictures.length > 0 ? (
        <Grid
          container
          justifyContent="center"
          sx={{ position: "relative", mt: "1rem" }}
        >
          {listingPictures.map((picture, index) => {
            return (
              <Box key={index}>
                {index === currentPicture ? (
                  <img
                    src={picture}
                    alt=""
                    style={{ width: "45rem", height: "35rem" }}
                  />
                ) : (
                  ""
                )}
              </Box>
            );
          })}
          <ArrowCircleLeftIcon
            onClick={() => {
              PreviousPicture();
            }}
            sx={{
              position: "absolute",
              cursor: "pointer",
              fontSize: "3rem",
              color: "white",
              top: "50%",
              left: "27.5%",
              "&:hover": {
                color: "#5dc800",
              },
            }}
          />
          <ArrowCircleRightIcon
            onClick={() => {
              NextPicture();
            }}
            sx={{
              position: "absolute",
              cursor: "pointer",
              fontSize: "3rem",
              color: "white",
              top: "50%",
              right: "27.5%",
              "&:hover": {
                color: "#5dc800",
              },
            }}
          />
        </Grid>
      ) : (
        ""
      )}

	  {/* More information */}
      <Grid
        container
        sx={{
          padding: "1rem",
          border: "1px solid black",
          marginTop: "1rem",
        }}
      >
        <Grid container size={7} direction="column" spacing={1}>
          <Grid>
            <Typography variant="h5">{state.listingInfo.title}</Typography>
          </Grid>
          <Grid>
            <RoomIcon />{" "}
            <Typography variant="h6">{state.listingInfo.borough}</Typography>
          </Grid>
          <Grid>
            <Typography variant="subtitle1">{formattedDate}</Typography>
          </Grid>
        </Grid>
        <Grid container size={5} alignItems="center">
          <Typography
            variant="h6"
            sx={{ fontWeight: "bolder", color: "green" }}
          >
            {state.listingInfo.listing_type} |{" "}
            {state.listingInfo.property_status === "Sale"
              ? `$${state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              : `$${state.listingInfo.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                  state.listingInfo.rental_frequency
                }`}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="flex-start"
        sx={{
          padding: "1rem",
          border: "1px solid black",
          marginTop: "1rem",
        }}
      >
        {state.listingInfo.rooms ? (
          <Grid size={2} sx={{ display: "flex" }}>
            <Typography variant="h6">
              {state.listingInfo.rooms} Rooms
            </Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.furnished ? (
          <Grid size={2} sx={{ display: "flex" }}>
            <CheckBoxIcon sx={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Furnished</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.pool ? (
          <Grid size={2} sx={{ display: "flex" }}>
            <CheckBoxIcon sx={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Pool</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.elevator ? (
          <Grid size={2} sx={{ display: "flex" }}>
            <CheckBoxIcon sx={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Elevator</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.cctv ? (
          <Grid size={2} sx={{ display: "flex" }}>
            <CheckBoxIcon sx={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Cctv</Typography>
          </Grid>
        ) : (
          ""
        )}

        {state.listingInfo.parking ? (
          <Grid size={2} sx={{ display: "flex" }}>
            <CheckBoxIcon sx={{ color: "green", fontSize: "2rem" }} />{" "}
            <Typography variant="h6">Parking</Typography>
          </Grid>
        ) : (
          ""
        )}
      </Grid>

      {/* Description */}
      {state.listingInfo.description ? (
        <Grid
          sx={{
            padding: "1rem",
            border: "1px solid black",
            marginTop: "1rem",
          }}
        >
          <Typography variant="h5">Description</Typography>
          <Typography variant="h6">{state.listingInfo.description}</Typography>
        </Grid>
      ) : (
        ""
      )}

      {/* Seller Info */}
      <Grid
        container
        sx={{
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto",
          border: "5px solid black",
          marginTop: "1rem",
          padding: "5px",
        }}
      >
        <Grid size={6}>
          <img
            style={{ height: "10rem", width: "15rem", cursor: "pointer" }}
            src={
              state.sellerProfileInfo.profile_picture !== null
                ? state.sellerProfileInfo.profile_picture
                : defaultProfilePicture
            }
            onClick={() =>
              navigate(`/agencies/${state.sellerProfileInfo.seller}`)
            }
          />
        </Grid>
        <Grid container direction="column" justifyContent="center" size={6}>
          <Grid>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", marginTop: "1rem" }}
            >
              <span style={{ color: "green", fontWeight: "bolder" }}>
                {state.sellerProfileInfo.agency_name}
              </span>
            </Typography>
          </Grid>
          <Grid>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", marginTop: "1rem" }}
            >
              <IconButton>
                <PhoneIcon /> {state.sellerProfileInfo.phone_number}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        {GlobalState.userId == state.listingInfo.seller ? (
          <Grid container justifyContent="space-around">
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Update
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={DeleteHandler}
              disabled={state.disabledBtn}
            >
              Delete
            </Button>
            <Dialog open={open} onClose={handleClose} fullScreen>
              <ListingUpdate
                listingData={state.listingInfo}
                closeDialog={handleClose}
              />
            </Dialog>
          </Grid>
        ) : (
          ""
        )}
      </Grid>

      {/* Map */}
      <Grid
        container
        sx={{ marginTop: "1rem" }}
        spacing={1}
        justifyContent="space-between"
      >
        <Grid size={3} sx={{ overflow: "auto", height: "35rem" }}>
          {state.listingInfo.listing_pois_within_10km.map((poi: any) => {
            function DegreeToRadian(coordinate: number) {
              return (coordinate * Math.PI) / 180;
            }

            function CalculateDistance() {
              const latitude1 = DegreeToRadian(state.listingInfo.latitude);
              const longitude1 = DegreeToRadian(state.listingInfo.longitude);

              const latitude2 = DegreeToRadian(poi.location.coordinates[0]);
              const longitude2 = DegreeToRadian(poi.location.coordinates[1]);
              // The formula
              const latDiff = latitude2 - latitude1;
              const lonDiff = longitude2 - longitude1;
              const R = 6371000 / 1000;

              const a =
                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                Math.cos(latitude1) *
                  Math.cos(latitude2) *
                  Math.sin(lonDiff / 2) *
                  Math.sin(lonDiff / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

              const dist = R * c;
              return dist.toFixed(2);
            }
            return (
              <Box
                key={poi.id}
                sx={{ marginBottom: "0.5rem", border: "1px solid black" }}
              >
                <Typography variant="h6">{poi.name}</Typography>
                <Typography variant="subtitle1">
                  {poi.type} |{" "}
                  <span style={{ fontWeight: "bolder", color: "green" }}>
                    {CalculateDistance()} Kilometers
                  </span>
                </Typography>
              </Box>
            );
          })}
        </Grid>
        <Grid size={9} sx={{ height: "35rem" }}>
          <MapContainer
            center={[state.listingInfo.latitude, state.listingInfo.longitude]}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                state.listingInfo.latitude,
                state.listingInfo.longitude,
              ]}
            >
              <Popup>{state.listingInfo.title}</Popup>
            </Marker>
            {state.listingInfo.listing_pois_within_10km.map((poi: any) => {
              function PoiIcon() {
                if (poi.type === "Stadium") {
                  return stadiumIcon;
                } else if (poi.type === "Hospital") {
                  return hospitalIcon;
                } else if (poi.type === "University") {
                  return universityIcon;
                }
              }
              return (
                <Marker
                  key={poi.id}
                  position={[
                    poi.location.coordinates[0],
                    poi.location.coordinates[1],
                  ]}
                  icon={PoiIcon()}
                >
                  <Popup>{poi.name}</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </Grid>
      </Grid>
      <Snackbar
        open={state.openSnack}
        message="You have successfully deleted the property!"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={3000}
        onClose={() => dispatch({ type: "closeTheSnack" })}
      />
    </Box>
  );
}

export default ListingDetails;
