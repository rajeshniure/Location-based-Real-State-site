import { Box, Button, TextField, Typography } from "@mui/material";
import {useNavigate} from "react-router-dom";

function Register() {
    const navigate = useNavigate();
  return (
    <>
    <Box sx={{
          width: "400px",
          margin: "25px auto",
          border: "3px solid #EBAF70",
          borderRadius: "16px",
        }}>
    <form action="">
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          margin: "0px auto ",
          padding: "20px",
          
        }}
      >
        <Typography variant="h4" textAlign="center" sx={{ fontWeight: "600" }}>
          Create an account
        </Typography>
        <TextField id="username" label="Username" variant="outlined" />
        <TextField id="email" label="Email" variant="outlined" />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
        />
        <TextField
          id="password2"
          label="Confirm Password"
          variant="outlined"
          type="password"
        />
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
          Sign Up
        </Button>
      </Box>
    </form>
    <Typography variant="body1" textAlign="center" sx={{ fontWeight: "600",pb:2 }}>
          Already have an account? <span onClick ={()=>navigate("/login")} style={{ color: "#00e676", cursor: "pointer" }}>Sign In </span> 
        </Typography>
        </Box>
        </>
  );
}

export default Register;
