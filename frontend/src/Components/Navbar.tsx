import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const menuItems: string[] = ["Listings", "Agencies"];

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

          {/* Desktop Menu */}
          <Box sx={{ ml: 5, display: { xs: "none", md: "flex" }, gap: 3 }}>
            {menuItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "white",
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

            <Button
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

          {/* Menu items using ul/li */}
          <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
            {menuItems.map((item) => (
              <li key={item} style={{ marginBottom: "1rem" }}>
                <Button
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
