import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Divider, Typography, useMediaQuery } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import { GET_ALL_COMMENTS_API } from "endpoints";
import Loader from "react-js-loader";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CommentWidget from "./CommentWidget";

const CommentsWidget = () => {
  const { postId } = useParams();
  const token = useSelector((state) => state.token);
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(10);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const getAllComments = async () => {
    setIsLoading(true);
    if (totalComments <= comments.length) return;
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${GET_ALL_COMMENTS_API.replace(
        "postId",
        postId
      )}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();

    setTotalComments(data.metaData.totalComments);
    setComments(comments.concat(data.comments));
    setPage(page + 1);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllComments();
  }, []);

  if (isLoading && comments.length === 0) {
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

  if (!comments.length && !isLoading) {
    return (
      <WidgetWrapper>
        <Typography
          variant='h2'
          textAlign={"center"}
          p='2rem 0'
          sx={{ color: palette.neutral.medium }}
        >
          No Comments
        </Typography>
      </WidgetWrapper>
    );
  }

  return (
    <Box sx={{ maxHeight: "65vh", pr: isNonMobileScreens ? "20%" : 0, overflowY: "scroll", scrollbarWidth: 'none' }}>
      <InfiniteScroll
        dataLength={totalComments}
        next={getAllComments}
        hasMore={comments.length < totalComments}
        loader={<Loader type='box-up' bgColor={dark} color={dark} size={80} />}
      >
        {comments.map(
          ({ _id, userId, name, description, location, userPicturePath, createdAt }) => {
            return (
              <Box
                key = {_id}
              >
                <CommentWidget
                  key={_id}
                  commentId={_id}
                  userId={userId}
                  name={name}
                  description={description}
                  location={location}
                  userPicturePath={userPicturePath}
                  createdAt = {createdAt}
                />
                <Divider sx={{m: '1rem 0'}} />
              </Box>
            );
          }
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default CommentsWidget;
