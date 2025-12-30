// import Axios from "axios";
import { useImmerReducer } from "use-immer";
// import { AxiosError } from "axios";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
// import { useNavigate } from "react-router-dom";

import { MapContainer, Marker, Polygon, TileLayer, useMap } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";
import { Marker as LeafletMarker } from "leaflet";
import { type LeafletEventHandlerFnMap } from "leaflet";


import { useEffect, useMemo, useRef } from "react";

import { boroughMap } from "../assets/Boroughs/Index";

type State = {
  titleValue: string;
  listingTypeValue: string;
  descriptionValue: string;
  areaValue: string;
  boroughValue: string;
  latitudeValue: string;
  longitudeValue: string;
  propertyStatusValue: string;
  priceValue: string;
  rentalFrequencyValue: string;
  roomsValue: string;
  furnishedValue: boolean;
  poolValue: boolean;
  elevatorValue: boolean;
  cctvValue: boolean;
  parkingValue: boolean;
  picture1value: string;
  picture2value: string;
  picture3value: string;
  picture4value: string;
  picture5value: string;
  mapInstance?: any;
  markerPosition: {
    lat: number;
    lng: number;
  };
};

type Action =
  | { type: "catchTitleChange"; titleChosen: string }
  | { type: "catchListingTypeChange"; listingTypeChosen: string }
  | { type: "catchDescriptionChange"; descriptionChosen: string }
  | { type: "catchAreaChange"; areaChosen: string }
  | { type: "catchBoroughChange"; boroughChosen: string }
  | { type: "catchLatitudeChange"; latitudeChosen: string }
  | { type: "catchLongitudeChange"; longitudeChosen: string }
  | { type: "catchPropertyStatusChange"; propertyStatusChosen: string }
  | { type: "catchPriceChange"; priceChosen: string }
  | { type: "catchRentalFrequencyChange"; rentalFrequencyChosen: string }
  | { type: "catchRoomsChange"; roomsChosen: string }
  | { type: "catchFurnishedChange"; furnishedChosen: boolean }
  | { type: "catchPoolChange"; poolChosen: boolean }
  | { type: "catchElevatorChange"; elevatorChosen: boolean }
  | { type: "catchCctvChange"; cctvChosen: boolean }
  | { type: "catchParkingChange"; parkingChosen: boolean }
  | { type: "catchPicture1Change"; picture1Chosen: string }
  | { type: "catchPicture2Change"; picture2Chosen: string }
  | { type: "catchPicture3Change"; picture3Chosen: string }
  | { type: "catchPicture4Change"; picture4Chosen: string }
  | { type: "catchPicture5Change"; picture5Chosen: string }
  | { type: "getMap"; mapData: LeafletMap }
  | { type: "changeMarkerPosition"; changeLatitude: number ; changeLongitude: number };

type AreaOption = {
  value: string;
  label: string;
};

const areaOptions: AreaOption[] = [
  {
    value: "",
    label: "",
  },
  {
    value: "Inner Kathmandu",
    label: "Inner Kathmandu",
  },
  {
    value: "Outer Kathmandu",
    label: "Outer Kathmandu",
  },
];

const innerKathmanduOptions: AreaOption[] = [
  {
    value: "",
    label: "",
  },
  { value: "thamel", label: "Thamel" },

  { value: "lazimpat", label: "Lazimpat" },
  { value: "naxal", label: "Naxal" },
  { value: "baluwatar", label: "Baluwatar" },
  { value: "maharajgunj", label: "Maharajgunj" },
  { value: "newroad", label: "New Road / Asan" },
  { value: "durbarmarg", label: "Durbar Marg" },
  { value: "putalisadak", label: "Putalisadak" },
  { value: "tripureshwor", label: "Tripureshwor" },
];

const outerKathmanduOptions: AreaOption[] = [
  {
    value: "",
    label: "",
  },
  { value: "budhanilkantha", label: "Budhanilkantha" },
  { value: "boudha", label: "Boudha / Jorpati" },
  { value: "kapan", label: "Kapan" },
  { value: "tokha", label: "Tokha" },
  { value: "dhapasi", label: "Dhapasi" },
  { value: "kalanki", label: "Kalanki" },
  { value: "syuchatar", label: "Syuchatar" },
  { value: "kirtipur", label: "Kirtipur" },
  { value: "balaju", label: "Balaju" },
  { value: "samakhushi", label: "Samakhushi" },
  { value: "chabahil", label: "Chabahil" },
];

const boroughCoordinates: { [key: string]: number[] } = {
  // Inner Kathmandu
  thamel: [27.7153, 85.3076],
  lazimpat: [27.7225, 85.3213],
  naxal: [27.7151, 85.3301],
  baluwatar: [27.7303, 85.3323],
  maharajgunj: [27.741, 85.332],
  newroad: [27.7051, 85.3113],
  durbarmarg: [27.7099, 85.316],
  putalisadak: [27.7032, 85.3235],
  tripureshwor: [27.6934, 85.3149],

  // Outer Kathmandu
  budhanilkantha: [27.7788, 85.3621],
  boudha: [27.7215, 85.362],
  kapan: [27.737, 85.3615],
  tokha: [27.7651, 85.3223],
  dhapasi: [27.7512, 85.329],
  kalanki: [27.6939, 85.2818],
  syuchatar: [27.6995, 85.269],
  kirtipur: [27.6799, 85.2754],
  balaju: [27.7335, 85.2975],
  samakhushi: [27.731, 85.312],
  chabahil: [27.7171, 85.3501],
};

function AddProperty() {
  // const navigate = useNavigate();

  const initialState: State = {
    titleValue: "",
    listingTypeValue: "",
    descriptionValue: "",
    areaValue: "",
    boroughValue: "",
    latitudeValue: "",
    longitudeValue: "",
    propertyStatusValue: "",
    priceValue: "",
    rentalFrequencyValue: "",
    roomsValue: "",
    furnishedValue: false,
    poolValue: false,
    elevatorValue: false,
    cctvValue: false,
    parkingValue: false,
    picture1value: "",
    picture2value: "",
    picture3value: "",
    picture4value: "",
    picture5value: "",
    markerPosition:{
      lat:27.705989268509068, 
      lng:85.31711091327156
    }
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchTitleChange":
        draft.titleValue = action.titleChosen;
        break;
      case "catchListingTypeChange":
        draft.listingTypeValue = action.listingTypeChosen;
        break;
      case "catchDescriptionChange":
        draft.descriptionValue = action.descriptionChosen;
        break;
      case "catchAreaChange":
        draft.areaValue = action.areaChosen;
        break;
      case "catchBoroughChange":
        draft.boroughValue = action.boroughChosen;
        break;
      case "catchLatitudeChange":
        draft.latitudeValue = action.latitudeChosen;
        break;
      case "catchLongitudeChange":
        draft.longitudeValue = action.longitudeChosen;
        break;
      case "catchPropertyStatusChange":
        draft.propertyStatusValue = action.propertyStatusChosen;
        break;
      case "catchPriceChange":
        draft.priceValue = action.priceChosen;
        break;
      case "catchRentalFrequencyChange":
        draft.rentalFrequencyValue = action.rentalFrequencyChosen;
        break;
      case "catchRoomsChange":
        draft.roomsValue = action.roomsChosen;
        break;
      case "catchFurnishedChange":
        draft.furnishedValue = action.furnishedChosen;
        break;
      case "catchPoolChange":
        draft.poolValue = action.poolChosen;
        break;
      case "catchElevatorChange":
        draft.elevatorValue = action.elevatorChosen;
        break;
      case "catchCctvChange":
        draft.cctvValue = action.cctvChosen;
        break;
      case "catchParkingChange":
        draft.parkingValue = action.parkingChosen;
        break;
      case "catchPicture1Change":
        draft.picture1value = action.picture1Chosen;
        break;
      case "catchPicture2Change":
        draft.picture2value = action.picture2Chosen;
        break;
      case "catchPicture3Change":
        draft.picture3value = action.picture3Chosen;
        break;
      case "catchPicture4Change":
        draft.picture4value = action.picture4Chosen;
        break;
      case "catchPicture5Change":
        draft.picture5value = action.picture5Chosen;
        break;
      case "getMap":
        draft.mapInstance = action.mapData;
        break;
      case "changeMarkerPosition":
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        draft.latitudeValue = "";
        draft.longitudeValue = "";
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

  useEffect(() => {
    const coords = boroughCoordinates[state.boroughValue];

    if (coords && state.mapInstance) {
      state.mapInstance.setView(coords, 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: coords[0],
        changeLongitude: coords[1],
      });
    }
  }, [state.boroughValue, state.mapInstance]);

  //Borough Display Function
  function BoroughDisplay() {
    const positions:any = boroughMap[state.boroughValue];

    if (!positions) return null;

    return <Polygon positions={positions} />;
  }

  // Draggable Marker Code
const markerRef = useRef<LeafletMarker | null>(null);  
const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
    () => ({
      dragend() {
        const marker:any = markerRef.current;
        dispatch({
          type:'catchLatitudeChange',
          latitudeChosen: marker.getLatLng().lat.toString()
        })
        dispatch({
          type:'catchLongitudeChange',
          longitudeChosen: marker.getLatLng().lng.toString()
        })

      },
    }),
    []
  );

  useEffect(()=>{
    console.log(state.latitudeValue, state.longitudeValue);

  },[state.latitudeValue, state.longitudeValue]);


  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("form is submitted! ");
    // dispatch({ type: "changeSendRequest" });
  }

  return (
    <Box
      sx={{
        width: "800px",
        margin: "25px auto",
        border: "3px solid #EBAF70",
        borderRadius: "16px",
      }}
    >
      <form action="" onSubmit={FormSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
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
            Submit A Property
          </Typography>
          <TextField
            id="title"
            label="Title"
            variant="standard"
            value={state.titleValue}
            onChange={(e) =>
              dispatch({
                type: "catchTitleChange",
                titleChosen: e.target.value,
              })
            }
          />
          <TextField
            id="listingType"
            label="Listing Type"
            variant="standard"
            value={state.listingTypeValue}
            onChange={(e) =>
              dispatch({
                type: "catchListingTypeChange",
                listingTypeChosen: e.target.value,
              })
            }
          />
          <TextField
            id="description"
            label="Description"
            variant="standard"
            value={state.descriptionValue}
            onChange={(e) =>
              dispatch({
                type: "catchDescriptionChange",
                descriptionChosen: e.target.value,
              })
            }
          />
          <TextField
            id="propertyStatus"
            label="Property Status"
            variant="standard"
            value={state.propertyStatusValue}
            onChange={(e) =>
              dispatch({
                type: "catchPropertyStatusChange",
                propertyStatusChosen: e.target.value,
              })
            }
          />
          <TextField
            id="rentalFrequency"
            label="Rental Frequency"
            variant="standard"
            value={state.rentalFrequencyValue}
            onChange={(e) =>
              dispatch({
                type: "catchRentalFrequencyChange",
                rentalFrequencyChosen: e.target.value,
              })
            }
          />
          <TextField
            id="rooms"
            label="Rooms"
            variant="standard"
            value={state.roomsValue}
            onChange={(e) =>
              dispatch({
                type: "catchRoomsChange",
                roomsChosen: e.target.value,
              })
            }
          />
          <TextField
            id="price"
            label="Price"
            variant="standard"
            value={state.priceValue}
            onChange={(e) =>
              dispatch({
                type: "catchPriceChange",
                priceChosen: e.target.value,
              })
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.furnishedValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchFurnishedChange",
                    furnishedChosen: e.target.checked,
                  })
                }
              />
            }
            label="Furnished"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.poolValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchPoolChange",
                    poolChosen: e.target.checked,
                  })
                }
              />
            }
            label="Pool"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.elevatorValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchElevatorChange",
                    elevatorChosen: e.target.checked,
                  })
                }
              />
            }
            label="Elevator"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.cctvValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchCctvChange",
                    cctvChosen: e.target.checked,
                  })
                }
              />
            }
            label="Cctv"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.parkingValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchParkingChange",
                    parkingChosen: e.target.checked,
                  })
                }
              />
            }
            label="Parking"
          />
          <Grid container spacing={2} justifyContent={"space-between"}>
            <Grid size={5}>
              <TextField
                fullWidth
                id="area"
                label="Area"
                variant="standard"
                value={state.areaValue}
                select
                onChange={(e) =>
                  dispatch({
                    type: "catchAreaChange",
                    areaChosen: e.target.value,
                  })
                }
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
              >
                {areaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid size={5}>
              <TextField
                fullWidth
                id="borough"
                label="Borough"
                variant="standard"
                value={state.boroughValue}
                select
                onChange={(e) =>
                  dispatch({
                    type: "catchBoroughChange",
                    boroughChosen: e.target.value,
                  })
                }
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
              >
                {state.areaValue === "Inner Kathmandu"
                  ? innerKathmanduOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  : ""}

                {state.areaValue === "Outer Kathmandu"
                  ? outerKathmanduOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  : ""}
              </TextField>
            </Grid>
          </Grid>

          {/* Map Container */}
          <Grid container spacing={2} sx={{ height: "30rem", mt: "1rem" }}>
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
              {BoroughDisplay()}
              <Marker
                draggable
                eventHandlers={eventHandlers}
                position={state.markerPosition}
                ref={markerRef}
              ></Marker>
            </MapContainer>
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
            Submit
          </Button>
        </Box>
      </form>
      <Button
        onClick={() =>
          state.mapInstance.flyTo([27.705989268509068, 85.31711091327156, 35])
        }
      >
        Test button
      </Button>
    </Box>
  );
}

export default AddProperty;
