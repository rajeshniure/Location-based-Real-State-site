import { useEffect, useMemo, useRef, useContext } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";

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


import { boroughMap } from "../assets/Boroughs/Index";

import StateContext from "../Contexts/StateContext";

type GlobalStateType = {
  userId: string;
  userIsLogged: boolean;
};

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
  sendRequest: number;
  userProfile: {
    agencyName: string;
    phoneNumber: string;
  };
  openSnack: boolean;
  disabledBtn: boolean;
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
  | { type: "catchPicture1Change"; picture1Chosen: File | null }
  | { type: "catchPicture2Change"; picture2Chosen: File | null }
  | { type: "catchPicture3Change"; picture3Chosen: File | null }
  | { type: "catchPicture4Change"; picture4Chosen: File | null }
  | { type: "catchPicture5Change"; picture5Chosen: File | null }
  | { type: "getMap"; mapData: LeafletMap }
  | {
      type: "changeMarkerPosition";
      changeLatitude: number;
      changeLongitude: number;
    }
  | { type: "catchUploadedPictures"; picturesChosen: File[] }
  | { type: "changeSendRequest" }
  | { type: "catchUserProfileInfo"; profileObject: any }
  | { type: "openTheSnack" }
  | { type: "closeTheSnack" }
  | { type: "disableTheButton" }
  | { type: "allowTheButton" };

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
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext) as GlobalStateType;

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
    mapInstance: null,
    markerPosition: {
      lat: 27.705989268509068,
      lng: 85.31711091327156,
    },
    uploadedPictures: [],
    sendRequest: 0,
    userProfile: {
      agencyName: "",
      phoneNumber: "",
    },
    openSnack: false,
		disabledBtn: false,
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
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
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
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response);
      }
    }
    GetProfileInfo();
  }, []);

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("form is submitted! ");
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function AddProperty() {
        const formData = new FormData();
        formData.append("title", state.titleValue);
        formData.append("description", state.descriptionValue);
        formData.append("area", state.areaValue);
        formData.append("borough", state.boroughValue);
        formData.append("listing_type", state.listingTypeValue);
        formData.append("property_status", state.propertyStatusValue);
        formData.append("price", state.priceValue);
        formData.append("rental_frequency", state.rentalFrequencyValue);
        formData.append("rooms", state.roomsValue);
        formData.append("furnished", state.furnishedValue.toString());
        formData.append("pool", state.poolValue.toString());
        formData.append("elevator", state.elevatorValue.toString());
        formData.append("cctv", state.cctvValue.toString());
        formData.append("parking", state.parkingValue.toString());
        formData.append("latitude", state.latitudeValue);
        formData.append("longitude", state.longitudeValue);
        if (state.picture1Value)
          formData.append("picture1", state.picture1Value);
        if (state.picture2Value)
          formData.append("picture2", state.picture2Value);
        if (state.picture3Value)
          formData.append("picture3", state.picture3Value);
        if (state.picture4Value)
          formData.append("picture4", state.picture4Value);
        if (state.picture5Value)
          formData.append("picture5", state.picture5Value);
        formData.append("seller", GlobalState.userId);

        try {
          await Axios.post(
            "http://127.0.0.1:8000/api/listings/create/",
            formData
          );
          dispatch({ type: "openTheSnack" });
        } catch (error) {
          const err = error as AxiosError;
          dispatch({ type: "allowTheButton" });
          console.log(err.response);
        }
      }
      AddProperty();
    }
  }, [state.sendRequest]);

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

  function SubmitButtonDisplay() {
    if (
      GlobalState.userIsLogged &&
      state.userProfile.agencyName !== null &&
      state.userProfile.agencyName !== "" &&
      state.userProfile.phoneNumber !== null &&
      state.userProfile.phoneNumber !== ""
    ) {
      return (
        <Button
          variant="contained"
          type="submit"
          sx={{
            width:"50%",
            mx:"auto",
            backgroundColor: "#EBAF70",
            color: "#252932",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#d99f5f",
            },
            "&:disabled": {
              backgroundColor: "rgba(235, 175, 112, 0.5)",
            },
          }}
          disabled={state.disabledBtn}
        >
          Submit
        </Button>
      );
    } else if (
      GlobalState.userIsLogged &&
      (state.userProfile.agencyName === null ||
        state.userProfile.agencyName === "") &&
      (state.userProfile.phoneNumber === null ||
        state.userProfile.phoneNumber === "")
    ) {
      return (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/profile")}
          sx={{
            borderColor: "#EBAF70",
            color: "#EBAF70",
            textTransform: "none",
            "&:hover": {
              borderColor: "#d99f5f",
              color: "#d99f5f",
              backgroundColor: "rgba(235, 175, 112, 0.1)",
            },
          }}
        >
          Complete your profile to add a property
        </Button>
      );
    } else if (!GlobalState.userIsLogged) {
      return (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/login")}
          sx={{
            borderColor: "#EBAF70",
            color: "#EBAF70",
            textTransform: "none",
            "&:hover": {
              borderColor: "#d99f5f",
              color: "#d99f5f",
              backgroundColor: "rgba(235, 175, 112, 0.1)",
            },
          }}
        >
          Sign in to add a property
        </Button>
      );
    }
  }
  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    }
  }, [state.openSnack]);

  return (
    <Box
      sx={{
        backgroundColor: "#252932",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(235, 175, 112, 0.2)",
          }}
        >
          <Box sx={{ p: 4 }}>
            <form action="" onSubmit={FormSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography
                  variant="h4"
                  textAlign="center"
                  sx={{
                    fontWeight: "bold",
                    color: "#EBAF70",
                    mb: 1,
                  }}
                >
                  Submit A Property
                </Typography>
                <TextField
                  id="title"
                  label="Title*"
                  variant="outlined"
                  value={state.titleValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchTitleChange",
                      titleChosen: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#EBAF70",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#EBAF70",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#EBAF70",
                    },
                  }}
                />
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      id="listingType"
                      label="Listing Type*"
                      variant="outlined"
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#EBAF70",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#EBAF70",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#EBAF70",
                        },
                      }}
                    >
                      {listingTypeOptions.map((option) => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      id="propertyStatus"
                      label="Property Status*"
                      variant="outlined"
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#EBAF70",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#EBAF70",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#EBAF70",
                        },
                      }}
                    >
                      {propertyTypeOptions.map((option) => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      id="rentalFrequency"
                      label="Rental Frequency"
                      variant="outlined"
                      disabled={state.propertyStatusValue === "Sale"}
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#EBAF70",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#EBAF70",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#EBAF70",
                        },
                      }}
                    >
                      {rentalFrequencyOptions.map((option) => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      id="price"
                      type="number"
                      label={PriceDisplay()}
                      variant="outlined"
                      value={state.priceValue}
                      onChange={(e) =>
                        dispatch({
                          type: "catchPriceChange",
                          priceChosen: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#EBAF70",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#EBAF70",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#EBAF70",
                        },
                      }}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#EBAF70",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#EBAF70",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#EBAF70",
                    },
                  }}
                />
                {state.listingTypeValue === "Office" ? (
                  ""
                ) : (
                  <Grid size={4}>
                    <TextField
                      id="rooms"
                      label="Rooms"
                      type="number"
                      variant="outlined"
                      value={state.roomsValue}
                      onChange={(e) =>
                        dispatch({
                          type: "catchRoomsChange",
                          roomsChosen: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#EBAF70",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#EBAF70",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#EBAF70",
                        },
                      }}
                    />
                  </Grid>
                )}

                <Grid container spacing={2}>
                  <Grid size={4}>
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
                          sx={{
                            color: "#EBAF70",
                            "&.Mui-checked": {
                              color: "#EBAF70",
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: "white" }}>Furnished</Typography>}
                    />
                  </Grid>
                  <Grid size={4}>
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
                          sx={{
                            color: "#EBAF70",
                            "&.Mui-checked": {
                              color: "#EBAF70",
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: "white" }}>Pool</Typography>}
                    />
                  </Grid>
                  <Grid size={4}>
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
                          sx={{
                            color: "#EBAF70",
                            "&.Mui-checked": {
                              color: "#EBAF70",
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: "white" }}>Elevator</Typography>}
                    />
                  </Grid>
                  <Grid size={4}>
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
                          sx={{
                            color: "#EBAF70",
                            "&.Mui-checked": {
                              color: "#EBAF70",
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: "white" }}>CCTV</Typography>}
                    />
                  </Grid>
                  <Grid size={4}>
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
                          sx={{
                            color: "#EBAF70",
                            "&.Mui-checked": {
                              color: "#EBAF70",
                            },
                          }}
                        />
                      }
                      label={<Typography sx={{ color: "white" }}>Parking</Typography>}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      id="area"
                      label="Area"
                      variant="outlined"
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#EBAF70",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#EBAF70",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#EBAF70",
                        },
                      }}
                    >
                      {areaOptions.map((option) => (
                        <option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={6}>
                    <TextField
                      fullWidth
                      id="borough"
                      label="Borough"
                      variant="outlined"
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#EBAF70",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#EBAF70",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#EBAF70",
                        },
                      }}
                    >
                      {state.areaValue === "Inner Kathmandu"
                        ? innerKathmanduOptions.map((option) => (
                            <option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
                              {option.label}
                            </option>
                          ))
                        : ""}

                      {state.areaValue === "Outer Kathmandu"
                        ? outerKathmanduOptions.map((option) => (
                            <option key={option.value} value={option.value} style={{ backgroundColor: "#252932" }}>
                              {option.label}
                            </option>
                          ))
                        : ""}
                    </TextField>
                  </Grid>
                </Grid>

                {/* Map Container */}
                <Box sx={{ height: "30rem", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(235, 175, 112, 0.2)" }}>
                  <MapContainer
                    center={[27.705989268509068, 85.31711091327156]}
                    zoom={14}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
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
                </Box>

                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    width:"50%",
                    mx:"auto",
                    borderColor: "#EBAF70",
                    color: "#EBAF70",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#d99f5f",
                      color: "#d99f5f",
                      backgroundColor: "rgba(235, 175, 112, 0.1)",
                    },
                  }}
                >
                  Upload Pictures (max 5)
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

                <Box sx={{ color: "white" }}>
                  {state.picture1Value && <Typography variant="body2">• {state.picture1Value.name}</Typography>}
                  {state.picture2Value && <Typography variant="body2">• {state.picture2Value.name}</Typography>}
                  {state.picture3Value && <Typography variant="body2">• {state.picture3Value.name}</Typography>}
                  {state.picture4Value && <Typography variant="body2">• {state.picture4Value.name}</Typography>}
                  {state.picture5Value && <Typography variant="body2">• {state.picture5Value.name}</Typography>}
                </Box>

                {SubmitButtonDisplay()}
              </Box>
            </form>
            <Snackbar
              open={state.openSnack}
              message="You have successfully added your property!"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              autoHideDuration={3000}
              onClose={() => dispatch({ type: "closeTheSnack" })}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AddProperty;
