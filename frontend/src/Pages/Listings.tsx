import { Box, Button, Grid, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

import houseIconPng from "../assets/Mapicons/house.png";
import apertmentIconPng from "../assets/Mapicons/apartment.png";
import officeIconPng from "../assets/Mapicons/office.png";

// import img1 from "../assets/img1.jpg"
import { useState } from "react";

import myListings from "../assets/Data/Dummydata";



export interface Listing {
  id: number;
  title: string;
  listing_type: "House" | "Apartment" | "Office";
  location: {
    coordinates: [number, number];
  };
  picture1: string;
  description: string;
}

function Listings() {
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

  const [latitude, setLatitude] = useState(27.705989268509068)
  const [longitude, setLongitude] = useState(85.31711091327156)

  function GoEast(){
    setLatitude(27.705556704779944);
    setLongitude(85.32283053794626);
  }
  function GoCenter(){
    setLatitude(27.705989268509068);
    setLongitude(85.31711091327156);
  }
  

  return (
    <Grid container spacing={2}>
      <Grid size={4} display={"flex"} flexDirection={"row"} alignItems="flex-start" padding={2} gap={2}>
       
         <Button variant="contained" onClick = {GoEast}>Go East</Button>
         <Button variant ="contained" onClick = {GoCenter}>Go Center</Button>
     
      
      </Grid>
      <Grid size={8}>
       
          <Box sx={{position:"sticky",top:'64px', height: "calc(100vh - 64px)" }}>
            <MapContainer
              center={[latitude, longitude]}
              zoom={14}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

          {myListings.map((listing: Listing) => {
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
                    <img src={listing.picture1} alt="" style={{ height: "14rem", width: "18rem" }} />
                    <Typography variant="body1">{listing.description}</Typography>
                    <Button variant="contained" fullWidth>Details</Button>
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