import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { GET_USER_API } from "endpoints";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "scenes/navbar";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserFriendsWidget from "scenes/widgets/UserFriendsWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const getUser = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${GET_USER_API}/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }
    setUser(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return (
      <Box
        width={"100%"}
        height='100%'
        m='1rem auto'
        display='flex'
        alignItems={"center"}
        justifyContent={"center"}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user && !isLoading) {
    return null;
  }

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? "flex" : "block"}
        gap='2rem'
        justifyContent={"center"}
      >
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined} // tells the width of this flex item
        >
          <WidgetWrapper
            sx = {{
              mb: 2
            }}
          >
            <Friend
              key={user?._id}
              friendId={user?._id}
              name={`${user?.firstName} ${user?.lastName}`}
              subtitle={user?.occupation}
              userPicturePath={user?.picturePath}
            />
          </WidgetWrapper>

          <UserFriendsWidget userId={userId} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined} // tells the width of this flex item
          mt={isNonMobileScreens ? 0 : 2}
        >
          <PostsWidget userId={userId} isProfile={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
