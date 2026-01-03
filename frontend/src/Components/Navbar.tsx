import { useState, useContext } from "react";
import Axios from "axios";
import { AxiosError } from "axios";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Drawer,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext";

import { useNavigate } from "react-router";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const menuItems: string[] = ["Listings", "Agencies"];

  const navigate = useNavigate();

  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    setAnchorEl(null);
    const confirmLogout = window.confirm("Are you sure you want to leave");
    if(confirmLogout && GlobalState){
        try {
      const response = await Axios.post(
        "http://127.0.0.1:8000/api-auth-djoser/token/logout/",
        GlobalState.userToken,
        {
          headers: {
            Authorization: `Token ${GlobalState.userToken}`,
          },
        }
      );
      console.log(response);
      if (GlobalDispatch) {
        GlobalDispatch({
          type: "logout",
        });
      }
      navigate("/");
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response);
    }
    }
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "#252932",
          borderBottom: "1px solid #787575ff",
          px: { xs: 0, md: 6 },
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          <Box
            onClick={() => navigate("/")}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ cursor: "pointer", color: "#EBAF70" }}
            >
              Ghar
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ cursor: "pointer" }}
            >
              Sewa
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ ml: 5, display: { xs: "none", md: "flex" }, gap: 3 }}>
            {menuItems.map((item) => (
              <Button
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                key={item}
                sx={{
                  color: "white",
                  fontSize: "16px",
                  textTransform: "none",
                  "&:hover": { color: "#EBAF70" },
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* Desktop Buttons */}
          <Box sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button
              onClick={() => navigate("/addproperty")}
              sx={{
                background: "#00e676",
                color: "#000",
                px: 3,
                borderRadius: "25px",
                textTransform: "none",
                "&:hover": { background: "#00c853" },
              }}
            >
              Add Property
            </Button>
            {GlobalState && GlobalState.userIsLogged ? (
              <Button
                onClick={handleClick}
                // onClick={() => navigate("/login")}
                sx={{
                  background: "#f5f5f5",
                  color: "#000",
                  px: 3,
                  borderRadius: "25px",
                  textTransform: "none",
                  "&:hover": { background: "#e0e0e0" },
                }}
              >
                {GlobalState.userUsername}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  background: "#f5f5f5",
                  color: "#000",
                  px: 3,
                  borderRadius: "25px",
                  textTransform: "none",
                  "&:hover": { background: "#e0e0e0" },
                }}
              >
                Login
              </Button>
            )}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleClose}
              slotProps={{
                list: {
                  "aria-labelledby": "basic-button",
                },
              }}
            >
              <MenuItem
                sx={{
                  color: "black",
                  backgroundColor: "#00e676",
                  width: "6rem",
                  fontWeight: "bolder",
                  borderRadius: "10px",
                  mx: "1rem",
                  mb: "1rem",
                }}
                onClick={handleClose}
              >
                Profile
              </MenuItem>
              <MenuItem
                sx={{
                  color: "black",
                  backgroundColor: "#EBAF70",
                  width: "6rem",
                  fontWeight: "bolder",
                  borderRadius: "10px",
                  mx: "1rem",
                }}
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Hamburger */}
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ ml: "auto", display: { md: "none" }, color: "white" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 250,
            background: "#252932",
            height: "100%",
            color: "white",
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
            {menuItems.map((item) => (
              <li key={item} style={{ marginBottom: "1rem" }}>
                <Button
                  onClick={() => navigate(`/${item.toLowerCase()}`)}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    width: "100%",
                    justifyContent: "flex-start",
                    "&:hover": { color: "#EBAF70" },
                  }}
                >
                  {item}
                </Button>
              </li>
            ))}

            <li style={{ marginBottom: "1rem" }}>
              <Button
                sx={{
                  background: "#00e676",
                  color: "#000",
                  px: 3,
                  borderRadius: "25px",
                  textTransform: "none",
                  width: "100%",
                  "&:hover": { background: "#00c853" },
                }}
              >
                Add Property
              </Button>
            </li>

            <li>
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  background: "#f5f5f5",
                  color: "#000",
                  px: 3,
                  borderRadius: "25px",
                  textTransform: "none",
                  width: "100%",
                  "&:hover": { background: "#e0e0e0" },
                }}
              >
                Login
              </Button>
            </li>
          </ul>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
