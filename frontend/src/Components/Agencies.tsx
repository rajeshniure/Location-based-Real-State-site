import { useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import defaultProfilePicture from "../assets/defaultProfilePicture.jpg";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Button,
  Typography,
  Container,
  Chip,
} from "@mui/material";

type State = {
  dataIsLoading: boolean;
  agenciesList: any[];
};

type Action =
  | { type: "catchAgencies"; agenciesArray: any[] }
  | { type: "loadingDone" };
;

function Agencies() {

  const navigate = useNavigate();

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
            Loading Agencies...
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
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#EBAF70",
              mb: 1,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Real Estate Agencies
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "white",
              fontSize: "1rem",
              opacity: 0.8,
            }}
          >
            Discover trusted agencies and their properties
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 4,
            justifyContent: "center",
          }}
        >
          {state.agenciesList.map((agency) => {
            function propertiesDisplay() {
              if (agency.seller_listings.length === 0) {
                return (
                  <Chip
                    label="No Properties"
                    disabled
                    size="small"
                    sx={{
                      opacity: 0.6,
                      fontSize: "0.75rem",
                    }}
                  />
                );
              } else if (agency.seller_listings.length === 1) {
                return (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/agencies/${agency.seller}`)}
                    sx={{
                      backgroundColor: "#EBAF70",
                      color: "#000",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      borderRadius: "25px",
                      "&:hover": {
                        backgroundColor: "#d99c4aff",
                      },
                    }}
                  >
                    One property listed
                  </Button>
                );
              } else {
                return (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/agencies/${agency.seller}`)}
                    sx={{
                      backgroundColor: "#EBAF70",
                      color: "#000",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      borderRadius: "25px",
                      "&:hover": {
                        backgroundColor: "#d99c4aff",
                      },
                    }}
                  >
                    {agency.seller_listings.length} properties listed
                  </Button>
                );
              }
            }

            if (agency.agency_name && agency.phone_number)
              return (
                <Card
                  key={agency.id}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0px 10px 25px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0px 15px 35px rgba(0,0,0,0.12)",
                    },
                    backgroundColor: "#98AF90",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: 200,
                      objectFit: "cover",
                    }}
                    image={
                      agency.profile_picture
                        ? agency.profile_picture
                        : defaultProfilePicture
                    }
                    title="Profile Picture"
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "#1A2027",
                        fontSize: "1.5rem",
                      }}
                    >
                      {agency.agency_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.7,
                        flexGrow: 1,
                        fontSize: "0.95rem",
                      }}
                    >
                      {agency.bio && agency.bio.length > 100
                        ? `${agency.bio.substring(0, 100)}...`
                        : agency.bio || "No description available"}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      p: 2,
                      pt: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {propertiesDisplay()}
                  </CardActions>
                </Card>
              );
          })}
        </Box>
      </Container>
    </Box>
  );
}

export default Agencies;
