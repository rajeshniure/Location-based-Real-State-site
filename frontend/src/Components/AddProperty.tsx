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

import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMap,
} from "react-leaflet";
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
  picture1Value: File | null;
  picture2Value: File | null;
  picture3Value: File | null;
  picture4Value: File | null;
  picture5Value: File | null;
  mapInstance?: any;
  markerPosition: {
    lat: number;
    lng: number;
  };
  uploadedPictures: File[];
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
  | { type: "catchPicture1Change"; picture1Chosen: File }
  | { type: "catchPicture2Change"; picture2Chosen: File }
  | { type: "catchPicture3Change"; picture3Chosen: File }
  | { type: "catchPicture4Change"; picture4Chosen: File }
  | { type: "catchPicture5Change"; picture5Chosen: File }
  | { type: "getMap"; mapData: LeafletMap }
  | {
      type: "changeMarkerPosition";
      changeLatitude: number;
      changeLongitude: number;
    }
  | { type: "catchUploadedPictures"; picturesChosen: File[] };

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
  { value: "", label: "" },
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
  { value: "", label: "" },
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

const listingTypeOptions: AreaOption[] = [
  { value: "", label: "" },
  { value: "Apartment", label: "Apartment" },
  { value: "House", label: "House" },
  { value: "Office", label: "Office" },
];

const propertyTypeOptions: AreaOption[] = [
  { value: "", label: "" },
  { value: "Sale", label: "Sale" },
  { value: "Rent", label: "Rent" },
];

const rentalFrequencyOptions: AreaOption[] = [
  { value: "", label: "" },
  { value: "Month", label: "Month" },
  { value: "Week", label: "Week" },
  { value: "Day", label: "Day" },
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
    picture1Value: null,
    picture2Value: null,
    picture3Value: null,
    picture4Value: null,
    picture5Value: null,
    markerPosition: {
      lat: 27.705989268509068,
      lng: 85.31711091327156,
    },
    uploadedPictures: [],
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
        draft.picture1Value = action.picture1Chosen;
        break;
      case "catchPicture2Change":
        draft.picture2Value = action.picture2Chosen;
        break;
      case "catchPicture3Change":
        draft.picture3Value = action.picture3Chosen;
        break;
      case "catchPicture4Change":
        draft.picture4Value = action.picture4Chosen;
        break;
      case "catchPicture5Change":
        draft.picture5Value = action.picture5Chosen;
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
      case "catchUploadedPictures":
        draft.uploadedPictures = action.picturesChosen;
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
    const positions: any = boroughMap[state.boroughValue];

    if (!positions) return null;

    return <Polygon positions={positions} />;
  }

  // Draggable Marker Code
  const markerRef = useRef<LeafletMarker | null>(null);
  const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
    () => ({
      dragend() {
        const marker: any = markerRef.current;
        dispatch({
          type: "catchLatitudeChange",
          latitudeChosen: marker.getLatLng().lat.toString(),
        });
        dispatch({
          type: "catchLongitudeChange",
          longitudeChosen: marker.getLatLng().lng.toString(),
        });
      },
    }),
    []
  );

  //catching picture files
  useEffect(() => {
    if (state.uploadedPictures[0]) {
      dispatch({
        type: "catchPicture1Change",
        picture1Chosen: state.uploadedPictures[0],
      });
    }
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[1]) {
      dispatch({
        type: "catchPicture2Change",
        picture2Chosen: state.uploadedPictures[1],
      });
    }
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[2]) {
      dispatch({
        type: "catchPicture3Change",
        picture3Chosen: state.uploadedPictures[2],
      });
    }
  }, [state.uploadedPictures[2]]);

  useEffect(() => {
    if (state.uploadedPictures[3]) {
      dispatch({
        type: "catchPicture4Change",
        picture4Chosen: state.uploadedPictures[3],
      });
    }
  }, [state.uploadedPictures[3]]);

  useEffect(() => {
    if (state.uploadedPictures[4]) {
      dispatch({
        type: "catchPicture5Change",
        picture5Chosen: state.uploadedPictures[4],
      });
    }
  }, [state.uploadedPictures[4]]);

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("form is submitted! ");
    // dispatch({ type: "changeSendRequest" });
  }

  function PriceDisplay() {
    if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue == "Day"
    ) {
      return "Price per Day*";
    } else if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue == "week"
    ) {
      return "Price per Week*";
    } else if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue == "Month"
    ) {
      return "Price per Month*";
    } else {
      return "Price*";
    }
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
            label="Title*"
            variant="standard"
            value={state.titleValue}
            onChange={(e) =>
              dispatch({
                type: "catchTitleChange",
                titleChosen: e.target.value,
              })
            }
          />
          <Grid container spacing={1} justifyContent={"space-between"}>
            <Grid size={5}>
              <TextField
                fullWidth
                id="listingType"
                label="Listing Type*"
                variant="standard"
                value={state.listingTypeValue}
                select
                onChange={(e) =>
                  dispatch({
                    type: "catchListingTypeChange",
                    listingTypeChosen: e.target.value,
                  })
                }
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
              >
                {listingTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid size={5}>
              <TextField
                fullWidth
                id="propertyStatus"
                label="Property Status*"
                variant="standard"
                select
                value={state.propertyStatusValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchPropertyStatusChange",
                    propertyStatusChosen: e.target.value,
                  })
                }
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
              >
                {propertyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={1} justifyContent={"space-between"}>
            <Grid size={5}>
              <TextField
                fullWidth
                id="rentalFrequency"
                label="Rental Frequency"
                variant="standard"
                disabled={state.propertyStatusValue === "Sale" ? true : false}
                value={state.rentalFrequencyValue}
                select
                onChange={(e) =>
                  dispatch({
                    type: "catchRentalFrequencyChange",
                    rentalFrequencyChosen: e.target.value,
                  })
                }
                slotProps={{
                  select: {
                    native: true,
                  },
                }}
              >
                {rentalFrequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid size={5}>
              <TextField
                fullWidth
                id="price"
                type="number"
                label={PriceDisplay()}
                variant="standard"
                value={state.priceValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchPriceChange",
                    priceChosen: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>

          <TextField
            id="description"
            label="Description"
            variant="outlined"
            multiline
            rows={5}
            value={state.descriptionValue}
            onChange={(e) =>
              dispatch({
                type: "catchDescriptionChange",
                descriptionChosen: e.target.value,
              })
            }
          />
          {state.listingTypeValue === "Office" ? (
            ""
          ) : (
            <Grid size={3}>
              <TextField
              id="rooms"
              label="Rooms"
              type="number"
              variant="standard"
              value={state.roomsValue}
              onChange={(e) =>
                dispatch({
                  type: "catchRoomsChange",
                  roomsChosen: e.target.value,
                })
              }
            />
            </Grid>
            
          )}

          <Grid container justifyContent={"space-between"}>
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
          </Grid>

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
            Upload Pictures(max 5 )
            <input
              type="file"
              multiple
              hidden
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) =>
                dispatch({
                  type: "catchUploadedPictures",
                  picturesChosen: Array.from(e.target.files || []),
                })
              }
            />
          </Button>

          <Grid container>
            <ul>
              {state.picture1Value ? <li>{state.picture1Value.name}</li> : ""}
              {state.picture2Value ? <li>{state.picture2Value.name}</li> : ""}
              {state.picture3Value ? <li>{state.picture3Value.name}</li> : ""}
              {state.picture4Value ? <li>{state.picture4Value.name}</li> : ""}
              {state.picture5Value ? <li>{state.picture5Value.name}</li> : ""}
            </ul>
          </Grid>

          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "50%",
              mx: "auto",
              // mt: "1rem",
              background: "#00e676",
              color: "#000",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { background: "#00c853" },
            }}
          >
            Submit
          </Button>
        </Box>
      </form>
      {/* <Button
        onClick={() =>
          console.log("Uploaded Pictures: ", state.uploadedPictures)
        }
      >
        Test button
      </Button> */}
    </Box>
  );
}

export default AddProperty;
