import { Box, Card, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import UserImage from "./UserImage";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";

const SearchUser = ({ name, _id, userPicturePath, subtitle }) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { searchParams } = useParams();
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)')
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const getHighlightedText = (text) => {
    const parts = text.split(new RegExp(`(${searchParams})`, 'gi'));
    return <span>{parts.map(part => part.toLowerCase() === searchParams.toLowerCase() ? <b>{part}</b> : part)}</span>;
  }

  return (
    <Card 
      elevation={2}
      style={{ width: isNonMobileScreens ? "50%" : '100%', padding: '1rem' }}
    >
      <Stack
        gap={2}
        direction={"row"}
        alignItems={"center"}
        style={{ width: isNonMobileScreens ? "50%" : '95%' }}
      >
        <UserImage image={userPicturePath} size={"55px"} />
        <Box
          onClick={() => {
            navigate(`/profile/${_id}`);
            navigate(0); //so that when a user jumps from one profile to another, the page refreshes
          }}
        >
          <Typography
            color={main}
            variant='h4'
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {getHighlightedText(name)}
          </Typography>
          <Typography color={medium} fontSize={"1rem"}>
            {getHighlightedText(subtitle)}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

export default SearchUser;
