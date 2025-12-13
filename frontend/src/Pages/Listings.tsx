import { useState, useEffect } from "react";
import Axios from "axios";
import { AxiosError } from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
} from "react-leaflet";
import { Icon } from "leaflet";

import polygonOne from "../Components/shape";
import houseIconPng from "../assets/Mapicons/house.png";
import apertmentIconPng from "../assets/Mapicons/apartment.png";
import officeIconPng from "../assets/Mapicons/office.png";

// import img1 from "../assets/img1.jpg"

// import myListings from "../assets/Data/Dummydata";

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
}

function Listings() {
  //  fetch("http://127.0.0.1:8000/api/listings/")
  //  .then(response => response.json())
  //  .then(data => console.log(data));

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

  // const [latitude, setLatitude] = useState(27.705989268509068);
  // const [longitude, setLongitude] = useState(85.31711091327156);

  // function GoEast() {
  //   setLatitude(27.705556704779944);
  //   setLongitude(85.32283053794626);
  // }
  // function GoCenter() {
  //   setLatitude(27.705989268509068);
  //   setLongitude(85.31711091327156);
  // }

  const polyOne: [number, number][] = [
    [27.705, 85.325],
    [27.71, 85.33],
    [27.715, 85.32],
  ];

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
                m: "0.5rem",
                border: "1px solid black",
                position: "relative",
              }}
            >
              <CardHeader
                // action={
                //   <IconButton aria-label="settings">
                //     <MoreVertIcon />
                //   </IconButton>
                // }
                title={listing.title}
              />
              <CardMedia
                component="img"
                image={listing.picture1}
                alt={listing.title}
                sx={{ px: "1rem", height: "20rem", width: "30rem" }}
              />
              <CardContent>
                <Typography variant="body2">
                  {listing.description.substring(0, 200)}...
                </Typography>
              </CardContent>
              {listing.property_status === "Sale" ? (
                <Typography
                  sx={{
                    position: "absolute",
                    top: "100px",
                    left: "20px",
                    padding: "5px",
                    backgroundColor: "#00e676",
                    zIndex: "1000",
                    color: "black",
                    borderRadius: "5px",
                  }}
                >
                  {listing.listing_type}: Rs{" "}
                  {listing.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    position: "absolute",
                    top: "100px",
                    left: "20px",
                    padding: "5px",
                    backgroundColor: "#00e676",
                    zIndex: "1000",
                    color: "black",
                    borderRadius: "5px",
                  }}
                >
                  {listing.listing_type}: Rs{" "}
                  {listing.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  / {listing.rental_frequency}
                </Typography>
              )}

              {/* <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

      </CardActions> */}
            </Card>
          );
        })}
      </Grid>
      <Grid size={8} sx={{ mt: "0.5rem" }}>
        <Box
          sx={{ position: "sticky", top: "72px", height: "calc(100vh - 64px)" }}
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
            <Polyline positions={polyOne} weight={10} color="green" />
            <Polygon
              positions={polygonOne}
              color="blue"
              fillColor="blue"
              fillOpacity={0.9}
            />

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

              return (
                <Marker
                  key={listing.id}
                  icon={IconDisplay()}
                  position={[
                    listing.location.coordinates[0],
                    listing.location.coordinates[1],
                  ]}
                >
                  <Popup>
                    <Typography variant="h5">{listing.title}</Typography>
                    <img
                      src={listing.picture1}
                      alt=""
                      style={{ height: "14rem", width: "18rem" }}
                    />
                    <Typography variant="body1">
                      {listing.description.substring(0, 120)}...
                    </Typography>
                    <Button variant="contained" fullWidth>
                      Details
                    </Button>
                  </Popup>
                </Marker>
              );
            })}

            {/* <Marker icon = {houseIcon} position={[latitude, longitude]}>
                <Popup>
                  <Typography variant="h5">A title</Typography>
                  <img src={img1} alt="" style={{height:'14rem',width:"18rem"}}/>
                  <Typography variant="body1"> A description below the title</Typography>
                  <Button variant="contained" fullWidth>A link</Button>
                </Popup>
              </Marker> */}
          </MapContainer>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Listings;
