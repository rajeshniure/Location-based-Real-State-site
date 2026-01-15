import { useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
// import StateContext from "../Contexts/StateContext";
import defaultProfilePicture from "../assets/defaultProfilePicture.jpg";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Button,
  //   Checkbox,
  //   FormControlLabel,
  Grid,
  // TextField,
  Typography,
} from "@mui/material";

type State = {
  dataIsLoading: boolean;
  agenciesList: any[];
};

type Action =
  | { type: "catchAgencies"; agenciesArray: any[] }
  | { type: "loadingDone" };

// type GlobalStateType = {
//   userId: string;
//   userIsLogged: boolean;
//   userUsername: string;
// };

function Agencies() {

  const navigate = useNavigate();
  // const GlobalState = useContext(StateContext) as GlobalStateType;

  const initialState: State = {
    dataIsLoading: true,
    agenciesList: [],
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchAgencies":
        draft.agenciesList = action.agenciesArray;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);
  //request to get all profiles
  useEffect(() => {
    async function GetAgencies() {
      try {
        const response = await Axios.get(`http://127.0.0.1:8000/api/profiles/`);
        console.log(response.data);
        dispatch({
          type: "catchAgencies",
          agenciesArray: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response);
      }
    }
    GetAgencies();
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
    <Grid container justifyContent="flex-start" spacing={2} sx={{ p: "10px" }}>
      {state.agenciesList.map((agency) => {
        function propertiesDisplay() {
          if (agency.seller_listings.length === 0) {
            return( 
            <Button disabled size="small">
              No Properties
            </Button>
            );
         
          }
          else if (agency.seller_listings.length === 1){
            return( 
            <Button size="small" onClick={()=>navigate(`/agencies/${agency.seller}`)}>
              One property listed
            </Button>
          );
        }
        else{
          return( 
            <Button size="small" onClick={()=>navigate(`/agencies/${agency.seller}`)}>
              {agency.seller_listings.length} properties listed
            </Button>
          );
        }
        }
        
        if (agency.agency_name && agency.phone_number)
          return (
            <Grid key={agency.id} sx={{ mt: "1rem", maxWidth: "20rem" }}>
              <Card>
                <CardMedia
                  sx={{ height: 140 }}
                  image={
                    agency.profile_picture
                      ? agency.profile_picture
                      : defaultProfilePicture
                  }
                  title="Profile Picture"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {agency.agency_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {agency.bio.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>{propertiesDisplay()}</CardActions>
              </Card>
            </Grid>
          );
      })}
    </Grid>
  );
}

export default Agencies;
