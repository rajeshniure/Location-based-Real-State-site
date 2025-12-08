import { Box, Button, Typography } from "@mui/material";
import Hero from "../assets/hero.png";

function HeroSection() {
  return (
    <Box
      sx={{
        height: { xs: "auto", md: "92vh" },
        backgroundColor: "#252932",
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        pl: { xs: 2, md: "100px" },
        pr: { xs: 2, md: 0 },
        pt: { xs: 4, md: 0 },
        pb: { xs: 8, md: 0 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          color: "white",
          maxWidth: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          mb: { xs: 4, md: 0 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "600",
            fontFamily: "Roboto",
            fontSize: { xs: "1.8rem", md: "4rem" },
          }}
        >
          Find Your Dream Property and Home on
        </Typography>
        <Box
          display={"flex"}
          
          alignItems="center"
          justifyContent={{ xs: "center", sm: "flex-start" }}
          mb={4}
          mt={1}
        >
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{
              cursor: "pointer",
              color: "#EBAF70",
              fontFamily: "Roboto",
              fontSize: { xs: "2.5rem", md: "5rem" },
              mr: { xs: 0, sm: 1 },
            }}
          >
            Ghar
          </Typography>
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{
              cursor: "pointer",
              fontFamily: "Roboto",
              fontSize: { xs: "2.5rem", md: "5rem" },
            }}
          >
            Sewa
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            fontSize: { xs: "1.2rem", md: "1.7rem" },
            backgroundColor: "#EBAF70",
            color: "#000",
            px: { xs: 3, md: 4 },
            py: { xs: 1, md: 1 },
            borderRadius: "30px",
            textTransform: "none",
            "&:hover": { background: "#d99c4aff" },
          }}
        >
          See all Properties
        </Button>
      </Box>

      <Box sx={{ width: { xs: "100%", md: "auto" }, textAlign: "center" }}>
        <img
          src={Hero}
          alt="Hero"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
}

export default HeroSection;
