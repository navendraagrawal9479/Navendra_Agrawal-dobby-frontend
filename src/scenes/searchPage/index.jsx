import { useTheme } from "@emotion/react";
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchUser from "components/SearchUser";
import WidgetWrapper from "components/WidgetWrapper";
import { SEARCH_API } from "endpoints";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "scenes/navbar";
import PostWidget from "scenes/widgets/PostWidget";

const SearchPage = () => {
  const { searchParams } = useParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const user = useSelector((state) => state.user);

  const fetchResults = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${SEARCH_API}/${searchParams}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      toast.error(data.message);
      navigate("/home");
      setIsLoading(false);
      return;
    }

    setPosts(data?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  let element = (
    <Stack
      gap={1}
      alignItems={!isNonMobileScreens ? "center" : ""}
      justifyContent={"center"}
      style={{ width: "95%", margin: "1rem auto" }}
    >
      <Typography
        color={palette.neutral.main}
        variant='h5'
        fontWeight={"450"}
        sx={{
          "&:hover": {
            color: palette.primary.light,
            cursor: "pointer",
          },
          alignSelf: "flex-start",
        }}
      >
        {`Search results for: ${searchParams}`}
      </Typography>
      {posts && <Stack
        direction={'row'}
        flexWrap={'wrap'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={2}
      >
        {posts?.map(
          ({
            _id,
            userId: postUserId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
            createdAt,
          }) => {
            if(postUserId !== user._id)return <></>
            return (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={postUserId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
                createdAt={createdAt}
              />
            );
          }
        )}
      </Stack>}
    </Stack>
  );

  if (isLoading && users.length === 0) {
    element = (
      <Box
        width={"100%"}
        m='1rem auto'
        display='flex'
        alignItems={"center"}
        justifyContent={"center"}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!users?.length && !isLoading) {
    element = (
      <WidgetWrapper>
        <Typography
          variant='h2'
          textAlign={"center"}
          p='2rem 0'
          sx={{ color: palette.neutral.medium }}
        >
          No Results Found
        </Typography>
      </WidgetWrapper>
    );
  }

  return (
    <Box>
      <Navbar />
      {element}
    </Box>
  );
};

export default SearchPage;
