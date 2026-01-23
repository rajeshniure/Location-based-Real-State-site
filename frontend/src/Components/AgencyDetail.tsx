import { useEffect } from "react";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { AxiosError } from "axios";
import {  useParams,useNavigate } from "react-router-dom";
import defaultProfilePicture from "../assets/defaultProfilePicture.jpg";

import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  IconButton,
  CardActions,
  CardContent,
  CardMedia,
  Card,
  Container,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

type Listing = {
  id: number;
  title: string;
  description: string;
  picture1: string | null;
  listing_type: string;
  property_status: "sale" | "rent";
  price: number;
  rental_frequency?: string;
};

type State = {
  userProfile: {
    agencyName: string;
    phoneNumber: string;
    profilePic: string;
    bio: string;
    sellerListings: Listing[];
  };
  dataIsLoading: boolean;
};

type Action =
  | { type: "catchUserProfileInfo"; profileObject: any }
  | { type: "loadingDone" };



function AgencyDetail() {
    const navigate = useNavigate();

  const params = useParams();

  const initialState: State = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };

  function ReducerFunction(draft: State, action: Action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileObject.agency_name;
        draft.userProfile.phoneNumber = action.profileObject.phone_number;
        draft.userProfile.profilePic = action.profileObject.profile_picture;
        draft.userProfile.bio = action.profileObject.bio;
        draft.userProfile.sellerListings = action.profileObject.seller_listings;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  //request to get profile info
  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://127.0.0.1:8000/api/profiles/${params.id}/`
        );
        console.log(response.data);
        dispatch({
          type: "catchUserProfileInfo",
          profileObject: response.data,
        });
        dispatch({ type: "loadingDone" });
      } catch (error) {
        const err = error as AxiosError;
        console.log(err.response);
      }
    }
    GetProfileInfo();
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
            Loading Agency Details...
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
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Agency Profile Card */}
        <Card
          sx={{
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
            backgroundColor: "#98AF90",
            mb: 4,
            width: "60%",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              p: 2,
              gap: 3,
            }}
          >
            {/* Profile Picture */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                src={
                  state.userProfile.profilePic !== null
                    ? state.userProfile.profilePic
                    : defaultProfilePicture
                }
                alt={state.userProfile.agencyName}
                sx={{
                  width: { xs: 120, md: 200 },
                  height: { xs: 120, md: 200 },
                  border: "4px solid #EBAF70",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                }}
              />
            </Box>

            {/* Agency Info */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "#1A2027",
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
              >
                {state.userProfile.agencyName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: "#EBAF70",
                    color: "#000",
                    "&:hover": {
                      backgroundColor: "#d99c4aff",
                    },
                  }}
                >
                  <PhoneIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1A2027",
                    fontWeight: 600,
                  }}
                >
                  {state.userProfile.phoneNumber}
                </Typography>
              </Box>

              {state.userProfile.bio && (
                <>
                  <Divider sx={{ my: 2, width: "100%", borderColor: "rgba(0,0,0,0.1)" }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#1A2027",
                      lineHeight: 1.7,
                      fontSize: "1rem",
                      maxWidth: "100%",
                    }}
                  >
                    {state.userProfile.bio}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Card>

        {/* Listings Section */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: "#EBAF70",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Properties ({state.userProfile.sellerListings.length})
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "white",
              fontSize: "1rem",
              opacity: 0.8,
              mb: 3,
            }}
          >
            Browse all properties listed by this agency
          </Typography>
        </Box>

        {state.userProfile.sellerListings.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                opacity: 0.7,
                fontWeight: 500,
              }}
            >
              No properties listed yet
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {state.userProfile.sellerListings.map((listing) => {
              return (
                <Card
                  key={listing.id}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0px 15px 35px rgba(0,0,0,0.2)",
                      },
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        sx={{
                          height: 200,
                          cursor: "pointer",
                          objectFit: "cover",
                        }}
                        image={
                          listing.picture1
                            ? `http://localhost:8000${listing.picture1}`
                            : defaultProfilePicture
                        }
                        title="Listing Picture"
                        onClick={() => navigate(`/listings/${listing.id}`)}
                      />
                      <Chip
                        label={listing.listing_type}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                          backdropFilter: "blur(4px)",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.25rem",
                          mb: 1,
                          color: "#1A2027",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {listing.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {listing.description.substring(0, 100)}...
                      </Typography>
                    </CardContent>
                    <Divider sx={{ opacity: 0.3 }} />
                    <CardActions
                      sx={{
                        p: 2,
                        pt: 1.5,
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: "#1A2027",
                          fontSize: "1rem",
                        }}
                      >
                        {listing.property_status === "sale"
                          ? `${listing.listing_type}: $${listing.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                          : `${listing.listing_type}: $${listing.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                              listing.rental_frequency
                            }`}
                      </Typography>
                    </CardActions>
                  </Card>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default AgencyDetail;
