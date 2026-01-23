import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StateContext from "../Contexts/StateContext";

import defaultProfilePicture from "../assets/defaultProfilePicture.jpg";
import templeIconPng from "../assets/Mapicons/house.png";
import hospitalIconPng from "../assets/Mapicons/hospital.png";
import universityIconPng from "../assets/Mapicons/university.png";

import ListingUpdate from "../Components/ListingUpdate";

import {
  Grid,
  Typography,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link,
  Dialog,
  Snackbar,
  Box,
  Container,
  Paper,
  Card,
  CardContent,
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

  const templeIcon = new Icon({
    iconUrl: templeIconPng,
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
    if (state.listingInfo && state.listingInfo.seller) {
      async function GetProfileInfo() {
        try {
          const response = await Axios.get(
            `http://127.0.0.1:8000/api/profiles/${state.listingInfo.seller}/`,
          );

          dispatch({
            type: "catchSellerProfileInfo",
            profileObject: response.data,
          });
          dispatch({ type: "loadingDone" });
        } catch (e) {
          console.error("Error fetching profile info:", e);
        }
      }
      GetProfileInfo();
    }
  }, [state.listingInfo.seller]);

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

  const handleUpdateSuccess = async () => {
    // Close dialog first
    handleClose();
    
    // Refresh listing data after successful update
    try {
      const response = await Axios.get(
        `http://127.0.0.1:8000/api/listings/${params.id}/`,
      );
      dispatch({
        type: "catchListingInfo",
        listingObject: response.data,
      });
      
      // Refresh seller profile info if seller ID exists
      if (response.data.seller) {
        try {
          const profileResponse = await Axios.get(
            `http://127.0.0.1:8000/api/profiles/${response.data.seller}/`,
          );
          dispatch({
            type: "catchSellerProfileInfo",
            profileObject: profileResponse.data,
          });
        } catch (profileError) {
          console.error("Error refreshing profile info:", profileError);
        }
      }
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error refreshing listing:", err);
    }
  };

  async function DeleteHandler() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing? This action cannot be undone.",
    );
    if (confirmDelete) {
      dispatch({ type: "disableTheButton" });
      try {
        await Axios.delete(
          `http://127.0.0.1:8000/api/listings/${params.id}/delete/`,
        );

        dispatch({ type: "openTheSnack" });
      } catch (e) {
        const err = e as AxiosError;
        console.error("Error deleting listing:", err);
        alert("Failed to delete listing. Please try again.");
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
          backgroundColor: "#252932",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: "#EBAF70",
              mb: 2
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: "white",
              fontWeight: 500
            }}
          >
            Loading Listing Details...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "91.2vh",
        backgroundColor: "#252932",
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              onClick={() => navigate("/listings")}
              sx={{ 
                cursor: "pointer",
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": { color: "#EBAF70" }
              }}
            >
              Listings
            </Link>
            <Typography sx={{ color: "#EBAF70" }}>
              {state.listingInfo.title}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Main 2-Column Grid */}
        <Grid container spacing={4}>
          {/* Left Column: Image Slider + Seller Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Image Slider */}
            {listingPictures.length > 0 ? (
              <Paper
                elevation={8}
                sx={{
                  position: "relative",
                  mb: 2,
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(235, 175, 112, 0.2)",
                }}
              >
                <Box sx={{ position: "relative", width: "100%", height: "25rem" }}>
                  {listingPictures.map((picture, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          opacity: index === currentPicture ? 1 : 0,
                          transition: "opacity 0.5s ease-in-out",
                        }}
                      >
                        <img
                          src={picture}
                          alt={`${state.listingInfo.title} - Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    );
                  })}
                  <ArrowCircleLeftIcon
                    onClick={PreviousPicture}
                    sx={{
                      position: "absolute",
                      cursor: "pointer",
                      fontSize: "3rem",
                      color: "white",
                      top: "50%",
                      left: "1rem",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "50%",
                      "&:hover": {
                        color: "#EBAF70",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  />
                  <ArrowCircleRightIcon
                    onClick={NextPicture}
                    sx={{
                      position: "absolute",
                      cursor: "pointer",
                      fontSize: "3rem",
                      color: "white",
                      top: "50%",
                      right: "1rem",
                      transform: "translateY(-50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "50%",
                      "&:hover": {
                        color: "#EBAF70",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  />
                </Box>
              </Paper>
            ) : (
              ""
            )}

            {/* Seller Info Card */}
            <Card
              elevation={8}
              sx={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(235, 175, 112, 0.2)",
              }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      component="img"
                      src={
                        state.sellerProfileInfo.profile_picture !== null
                          ? state.sellerProfileInfo.profile_picture
                          : defaultProfilePicture
                      }
                      onClick={() =>
                        navigate(`/agencies/${state.sellerProfileInfo.seller}`)
                      }
                      sx={{
                        height: "10rem",
                        width: "10rem",
                        cursor: "pointer",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #EBAF70",
                        "&:hover": {
                          transform: "scale(1.05)",
                          transition: "transform 0.3s ease",
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={12} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#EBAF70",
                        fontWeight: "bolder",
                        mb: 1,
                      }}
                    >
                      {state.sellerProfileInfo.agency_name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <PhoneIcon sx={{ color: "#EBAF70" }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                        }}
                      >
                        {state.sellerProfileInfo.phone_number}
                      </Typography>
                    </Box>
                  </Grid>
                  {String(GlobalState.userId) === String(state.listingInfo.seller) ? (
                    <Grid size={12} sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        sx={{
                          backgroundColor: "#EBAF70",
                          color: "#252932",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#d99f5f",
                          },
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={DeleteHandler}
                        disabled={state.disabledBtn}
                        sx={{
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#d32f2f",
                          },
                          "&:disabled": {
                            backgroundColor: "rgba(211, 47, 47, 0.5)",
                          },
                        }}
                      >
                        {state.disabledBtn ? "Deleting..." : "Delete"}
                      </Button>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Title and Price Card */}
            <Card
              elevation={8}
              sx={{
                mb: 2,
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(235, 175, 112, 0.2)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h4"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  {state.listingInfo.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <RoomIcon sx={{ color: "#EBAF70" }} />
                  <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {state.listingInfo.borough}
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                  Posted on {formattedDate}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pt: 1,
                    borderTop: "1px solid rgba(235, 175, 112, 0.2)",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bolder",
                      color: "#EBAF70",
                    }}
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
                </Box>
              </CardContent>
            </Card>

            {/* Amenities Card */}
            <Card
              elevation={8}
              sx={{
                mb: 2,
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(235, 175, 112, 0.2)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#EBAF70",
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  Amenities
                </Typography>
                <Grid container spacing={2}>
                  {state.listingInfo.rooms ? (
                    <Grid size={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" sx={{ color: "white" }}>
                        {state.listingInfo.rooms} Rooms
                      </Typography>
                    </Grid>
                  ) : (
                    ""
                  )}

                  {state.listingInfo.furnished ? (
                    <Grid size={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckBoxIcon sx={{ color: "#EBAF70", fontSize: "1.5rem" }} />
                      <Typography variant="h6" sx={{ color: "white" }}>
                        Furnished
                      </Typography>
                    </Grid>
                  ) : (
                    ""
                  )}

                  {state.listingInfo.pool ? (
                    <Grid size={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckBoxIcon sx={{ color: "#EBAF70", fontSize: "1.5rem" }} />
                      <Typography variant="h6" sx={{ color: "white" }}>
                        Pool
                      </Typography>
                    </Grid>
                  ) : (
                    ""
                  )}

                  {state.listingInfo.elevator ? (
                    <Grid size={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckBoxIcon sx={{ color: "#EBAF70", fontSize: "1.5rem" }} />
                      <Typography variant="h6" sx={{ color: "white" }}>
                        Elevator
                      </Typography>
                    </Grid>
                  ) : (
                    ""
                  )}

                  {state.listingInfo.cctv ? (
                    <Grid size={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckBoxIcon sx={{ color: "#EBAF70", fontSize: "1.5rem" }} />
                      <Typography variant="h6" sx={{ color: "white" }}>
                        CCTV
                      </Typography>
                    </Grid>
                  ) : (
                    ""
                  )}

                  {state.listingInfo.parking ? (
                    <Grid size={6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckBoxIcon sx={{ color: "#EBAF70", fontSize: "1.5rem" }} />
                      <Typography variant="h6" sx={{ color: "white" }}>
                        Parking
                      </Typography>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Description Card */}
            {state.listingInfo.description ? (
              <Card
                elevation={8}
                sx={{
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(235, 175, 112, 0.2)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#EBAF70",
                      fontWeight: "bold",
                    }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {state.listingInfo.description}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              ""
            )}
          </Grid>
        </Grid>

        {/* Map Section */}
        <Box sx={{ mt: 4 }}>
          <Card
            elevation={8}
            sx={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(235, 175, 112, 0.2)",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      overflow: "auto",
                      height: "35rem",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#EBAF70",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      Nearby Places
                    </Typography>
                    {state.listingInfo.listing_pois_within_10km.map((poi: any) => {
                      function DegreeToRadian(coordinate: number) {
                        return (coordinate * Math.PI) / 180;
                      }

                      function CalculateDistance() {
                        const latitude1 = DegreeToRadian(state.listingInfo.latitude);
                        const longitude1 = DegreeToRadian(state.listingInfo.longitude);

                        const latitude2 = DegreeToRadian(poi.location.coordinates[0]);
                        const longitude2 = DegreeToRadian(poi.location.coordinates[1]);
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
                          sx={{
                            mb: 2,
                            p: 1.5,
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(235, 175, 112, 0.2)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            },
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: "white", fontWeight: "bold", mb: 0.5 }}
                          >
                            {poi.name}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                            {poi.type} |{" "}
                            <span style={{ fontWeight: "bolder", color: "#EBAF70" }}>
                              {CalculateDistance()} km
                            </span>
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ height: "35rem", borderRadius: "0 16px 16px 0", overflow: "hidden" }}>
                    <MapContainer
                      center={[state.listingInfo.latitude, state.listingInfo.longitude]}
                      zoom={14}
                      scrollWheelZoom={true}
                      style={{ height: "100%", width: "100%" }}
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
                          if (poi.type === "Temple") {
                            return templeIcon;
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
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Dialog open={open} onClose={handleClose} fullScreen>
        <ListingUpdate
          listingData={state.listingInfo}
          closeDialog={handleUpdateSuccess}
        />
      </Dialog>

      <Snackbar
        open={state.openSnack}
        message="You have successfully deleted the property!"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={3000}
        onClose={() => dispatch({ type: "closeTheSnack" })}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#EBAF70",
            color: "#252932",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
}

export default ListingDetails;
