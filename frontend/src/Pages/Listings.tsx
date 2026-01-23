import { useState, useEffect } from "react";
import Axios from "axios";
import { AxiosError } from "axios";
import { useImmerReducer } from "use-immer";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,

  CardMedia,
  CircularProgress,
  Grid,
  Typography,
 
  CardActions,
  Avatar,
  Divider,

  Fab,
  Chip,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,

} from "react-leaflet";
import { Icon } from "leaflet";
import { Map as LeafletMap } from "leaflet";

import RoomIcon from '@mui/icons-material/Room';

import houseIconPng from "../assets/Mapicons/house.png";
import apertmentIconPng from "../assets/Mapicons/apartment.png";
import officeIconPng from "../assets/Mapicons/office.png";

export interface Listing {
  id: number;
  title: string;
  listing_type: "House" | "Apartment" | "Office";
  location: {
    coordinates: [number, number];
  };
  picture1: string;
  description: string;
  price: number;
  property_status: "Rent" | "Sale";
  rental_frequency?: "Day" | "Week" | "Month" | null;
  latitude: number | null;
  longitude: number | null;
  seller_username: string;
  seller_agency_name: string;
}

type State = {
  mapInstance?: any;
}

type Action =
| { type: "getMap"; mapData: LeafletMap }

function Listings() {

  const navigate = useNavigate();

  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40],
  });
  const apertmentIcon = new Icon({
    iconUrl: apertmentIconPng,
    iconSize: [40, 40],
  });
  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40],
  });


  const initialState: State = {
    mapInstance: null,
    };
   
    function ReducerFunction(draft: State, action: Action) {
      switch (action.type) {
        
        case "getMap":
          draft.mapInstance = action.mapData;
          break;

      }
    }
  
    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);
  
    function TheMapComponent() {
      const map = useMap();
      dispatch({
        type: "getMap",
        mapData: map,
      });
      return null;
    }


  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function GetAllListing() {
      try {
        const response = await Axios.get(
          "http://127.0.0.1:8000/api/listings/",
          { cancelToken: source.token }
        );
        //  console.log(response.data);
        setAllListings(response.data);
        setDataIsLoading(false);
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response);
      }
    }
    GetAllListing();
    return () => {
      source.cancel();
    };
  }, []);

  if (dataIsLoading === false) {
    console.log(allListings[0].location);
  }
  if (dataIsLoading === true) {
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
    <Box
      sx={{
        backgroundColor: "#252932",
        pr:1
      }}
    >
      <Grid container spacing={2}>
        <Grid
          size={4}
          display={"flex"}
          flexDirection={"column"}
          alignItems="flex-start"
        >
        {allListings.map((listing: Listing) => {
          return (
            <Card
                key={listing.id}
                sx={{
                  m: "1rem",
                  maxWidth: 500,
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease-in-out",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0px 15px 35px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {/* Image Section with Overlays */}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={listing.picture1}
                    alt={listing.title}
                    sx={{ height: 280, cursor: "pointer", objectFit: "cover" }}
                    onClick={() => navigate(`/listings/${listing.id}`)}
                  />

                  {/* Status Badge (Listing Type) */}
                  <Chip
                    label={listing.listing_type}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      backdropFilter: "blur(4px)",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                    }}
                  />

                  {/* Price Tag Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      bgcolor: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1A2027" }}>
                      Rs {listing.price.toLocaleString()}
                      {listing.property_status !== "Sale" && (
                        <Box component="span" sx={{ fontSize: "0.8rem", fontWeight: 400, color: "text.secondary" }}>
                          /{listing.rental_frequency}
                        </Box>
                      )}
                    </Typography>
                  </Box>

                  {/* Map Action Button (Fly To) */}
                  <Fab
                    size="small"
                    color="primary"
                    onClick={() => state.mapInstance.flyTo([listing.latitude, listing.longitude], 16)}
                    sx={{
                      position: "absolute",
                      bottom: -20,
                      right: 20,
                      zIndex: 2,
                      boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
                    }}
                  >
                    <RoomIcon />
                  </Fab>
                </Box>

                <CardContent sx={{ pt: 1, pb: 1 }}>
                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {listing.title}
                  </Typography>

                  {/* Description (Truncated) */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      height: "40px",
                      lineHeight: "20px",
                      mb: 1,
                    }}
                  >
                    {listing.description.substring(0, 200)}...
                  </Typography>

                </CardContent>

                <Divider variant="middle" sx={{ opacity: 0.6 }} />

                <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1.5 }}>
                  {/* Seller Info */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: "secondary.main", fontSize: "0.7rem", mr: 1 }}>
                      {(listing.seller_agency_name || listing.seller_username || "?").charAt(0)}
                    </Avatar>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                      {listing.seller_agency_name || "Independent Seller"}
                    </Typography>
                  </Box>

                </CardActions>
              </Card>
          );
        })}
      </Grid>
      <Grid size={8} sx={{ mt: "0.5rem" }}>
        <Box
          sx={{ position: "sticky", top: "72px", height: "calc(100vh - 80px)" }}
        >
          <MapContainer
            center={[27.705989268509068, 85.31711091327156]}
            zoom={14}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TheMapComponent />

            {allListings.map((listing: Listing) => {
              const IconDisplay = () => {
                if (listing.listing_type === "House") {
                  return houseIcon;
                } else if (listing.listing_type === "Apartment") {
                  return apertmentIcon;
                } else if (listing.listing_type === "Office") {
                  return officeIcon;
                }
              };

              if (listing.latitude === null || listing.longitude === null) {
                return null;
              }

              return (
                <Marker
                  key={listing.id}
                  icon={IconDisplay()}
                  position={[
                    listing.latitude,
                    listing.longitude,
                  ]}
                >
                  <Popup>
                    <Typography variant="h5">{listing.title}</Typography>
                    <img
                      src={listing.picture1}
                      alt=""
                      style={{ height: "14rem", width: "18rem",cursor: "pointer" }}
                      onClick = {()=> navigate(`/listings/${listing.id}`)}

                    />
                    <Typography variant="body1">
                      {listing.description.substring(0, 120)}...
                    </Typography>
                    <Button variant="contained" fullWidth onClick = {()=> navigate(`/listings/${listing.id}`)}
>
                      Details
                    </Button>
                  </Popup>
                </Marker>
              );
            })}

          </MapContainer>
        </Box>
      </Grid>
    </Grid>
    </Box>
  );
  
}

export default Listings;
