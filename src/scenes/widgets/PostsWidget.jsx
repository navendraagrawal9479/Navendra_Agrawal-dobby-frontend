import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostWidget from "./PostWidget";
import { FEED_POSTS_API, FRIEND_LIST_API, USER_POSTS_API } from "endpoints";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-js-loader";
import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Typography } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { setFriends } from "state";

const PostsWidget = ({ userId, isProfile = false }) => {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.token);
  const _id = useSelector(state => state.user._id);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(10);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;

  const getUserPosts = async () => {
    setIsLoading(true);
    if (totalPosts <= posts.length) return;
    const endPoint = `${USER_POSTS_API.replace("userId", userId)}`;
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${endPoint}?page=${page}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    setTotalPosts(data.metaData.totalPosts);
    setPosts(posts.concat(data.posts));
    setPage(page + 1);
    setIsLoading(false);
  };

  const getPosts = async () => {
    setIsLoading(true);
    if (totalPosts <= posts.length) return;
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${FEED_POSTS_API}?page=${page}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    setTotalPosts(data?.metaData?.totalPosts);
    setPosts(posts.concat(data?.posts));
    setPage(page + 1);
    setIsLoading(false);
  };

  const getFriends = async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${FRIEND_LIST_API.replace(
        "userId",
        id
      )}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    console.log(data);
    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
      getFriends(userId);
    } else {
      getPosts();
      getFriends(_id);
    }
  }, []);

  if (isLoading && posts.length === 0) {
    return (
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

  if (!posts?.length) {
    return (
      <WidgetWrapper>
        <Typography
          variant='h2'
          textAlign={"center"}
          p='2rem 0'
          sx={{ color: palette.neutral.medium }}
        >
          No Posts
        </Typography>
      </WidgetWrapper>
    );
  }

  return (
    <InfiniteScroll
      dataLength={totalPosts}
      next={isProfile ? getUserPosts : getPosts}
      hasMore={posts?.length < totalPosts}
      loader={<Loader type='box-up' bgColor={dark} color={dark} size={80} />}
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
    </InfiniteScroll>
  );
};

export default PostsWidget;
