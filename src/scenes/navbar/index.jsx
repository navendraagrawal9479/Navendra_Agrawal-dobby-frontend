import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Search,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate, useParams } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const { searchParams } = useParams();
  const [searchValue, setSearchValue] = useState(
    searchParams ? searchParams : ""
  );
  const [searchPalette, setSearchPalette] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <Box>
      <FlexBetween padding='1rem 6%' backgroundColor={alt}>
        <FlexBetween gap='1rem'>
          {!isNonMobileScreens && (
            <IconButton
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}
          {(isNonMobileScreens || (!isNonMobileScreens && !searchPalette)) && (
            <Typography
              fontWeight='bold'
              fontSize='clamp(1rem, 2rem, 2.25rem)'
              color='primary'
              onClick={() => navigate("/home")}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              SocioGram
            </Typography>
          )}
          {(isNonMobileScreens || searchPalette) && (
            <form
              onSubmit={() => {
                if (searchValue) {
                  navigate(`/search/${searchValue}`);
                }
              }}
            >
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius='9px'
                gap='3rem'
                padding='0.1rem 1rem'
              >
                <InputBase
                  placeholder='Search...'
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
                <IconButton type='submit'>
                  <Search />
                </IconButton>
              </FlexBetween>
            </form>
          )}
          {!isNonMobileScreens &&
            (searchPalette ? (
              <IconButton
                onClick={() => {
                  setSearchPalette(false);
                }}
              >
                <Close />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setSearchPalette(true);
                }}
              >
                <Search />
              </IconButton>
            ))}
        </FlexBetween>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
          <FlexBetween gap='2rem'>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: "25px" }} />
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant='standard' value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem
                  value={
                    fullName.length >= 10
                      ? `${fullName.slice(0, 10)}...`
                      : fullName
                  }
                >
                  <Button
                    onClick={() => {
                      navigate(`/profile/${user?._id}`);
                    }}
                  >
                    {fullName.length >= 10
                      ? `${fullName.slice(0, 10)}...`
                      : fullName}
                  </Button>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(setLogout());
                    navigate("/");
                  }}
                >
                  <Button>Log Out</Button>
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )}
        {/* Mobile nav  */}
        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position={"fixed"}
            right='0'
            bottom='0'
            height='100%'
            zIndex={10}
            maxWidth={"500px"}
            minWidth={"300px"}
            backgroundColor={background}
          >
            <Box display='flex' alignItems={"flex-end"} p='1rem'>
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <Close />
              </IconButton>
            </Box>

            <FlexBetween
              gap='2rem'
              flexDirection={"column"}
              justifyContent={"center"}
            >
              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>
              <Message sx={{ fontSize: "25px" }} />
              <Notifications sx={{ fontSize: "25px" }} />
              <Help sx={{ fontSize: "25px" }} />
              {/* <FormControl variant='standard' value={fullName.length >= 10 ? `${fullName.slice(0, 10)}...` : fullName}>
              <Select
                value={fullName.length >= 10 ? `${fullName.slice(0, 10)}...` : fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              > */}
              <MenuItem>
                <Button
                  onClick={() => {
                    navigate(`/profile/${user?._id}`);
                  }}
                >
                  {fullName.length >= 10
                    ? `${fullName.slice(0, 10)}...`
                    : fullName}
                </Button>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                  navigate("/");
                }}
              >
                <Button>Log Out</Button>
              </MenuItem>
              {/* </Select> */}
              {/* </FormControl> */}
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
    </Box>
  );
};

export default Navbar;
