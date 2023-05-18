import Navbar from "scenes/navbar";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? "flex" : "block"}
        gap='0.5rem'
        justifyContent={"space-between"}
      >
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined} // tells the width of this flex item
        >
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined} // tells the width of this flex item
          mt={isNonMobileScreens ? "0" : "2rem"}
        >
            <MyPostWidget picturePath={picturePath} />
            <PostsWidget userId={_id} isProfile={true} />
        </Box>

        {isNonMobileScreens && (
          <Box
            flexBasis={isNonMobileScreens ? "26%" : undefined} // tells the width of this flex item
          >
            <FriendListWidget userId = {_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
