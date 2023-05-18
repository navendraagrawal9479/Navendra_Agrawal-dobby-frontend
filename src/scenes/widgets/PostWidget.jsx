import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { DELETE_POST_API, LIKE_POST_API } from "endpoints";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setPost } from "state";
import Loader from "react-js-loader";
import moment from "moment";

// likes structure =>
// likes = {
//   "userId1": true,
//   "userId2": true
// }

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
  page,
}) => {
  const { palette } = useTheme();
  const Location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const [isLiked, setIsLiked] = useState(Boolean(likes[loggedInUserId])); // check if the current user has liked the post or not
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(
    Number(Object.keys(likes).length)
  ); // how many keys are there in the map
  const navigate = useNavigate();
  const main = palette.neutral.main;
  const primary = palette.primary.dark;
  const dark = palette.neutral.dark;

  const patchLike = async () => {
    setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    setIsLiked(!isLiked);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${LIKE_POST_API.replace(
        "postId",
        postId
      )}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${DELETE_POST_API.replace(
        "postId",
        postId
      )}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      navigate(0);
      toast.success("Post Deleted");
    } else {
      toast.error("An error occured.");
    }
    setIsLoading(false);
  };

  return (
    <WidgetWrapper mb={2}>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Box
        onClick={() => {
          if (!page) {
            navigate(`/posts/${postId}`);
          }
        }}
        sx={{ cursor: "pointer" }}
      >
        <Typography color={main} sx={{ mt: "1rem", mb: "0.5rem" }}>
          {description}
        </Typography>
        <Typography color={palette.neutral.medium} sx={{ fontSize: "0.7rem" }}>
          {moment.utc(createdAt).local().startOf("seconds").fromNow()}
        </Typography>

        {picturePath && (
          <img
            width='100%'
            height='auto'
            alt='post'
            id='image'
            style={{ marginTop: "1rem", borderRadius: "0.5rem" }}
            src={picturePath}
            onClick={() => {
              if (page === "post") {
                document.getElementById('image')?.requestFullscreen()
              }
            }}
          />
        )}
      </Box>

      <FlexBetween mt='0.25rem'>
        <FlexBetween gap='1rem'>
          <FlexBetween gap='0.3rem'>
            <IconButton onClick={() => patchLike()}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>

            <Typography>{likesCount}</Typography>
          </FlexBetween>
          <FlexBetween>
            <IconButton
              onClick={() => {
                if (!Location.pathname.includes("posts")) {
                  navigate(`/posts/${postId}`);
                }
              }}
            >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {loggedInUserId === postUserId && (
          <IconButton
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <FlexBetween>
              <DeleteIcon />

              <Typography>DELETE POST</Typography>
            </FlexBetween>
          </IconButton>
        )}
      </FlexBetween>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DialogTitle id='alert-delete-title'>Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Click on Confirm to delete your post.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoading ? (
            <Loader type='box-up' bgColor={dark} color={dark} size={80} />
          ) : (
            <IconButton
              onClick={() => {
                handleDelete();
              }}
            >
              <FlexBetween>
                <DeleteIcon />

                <Typography>CONFIRM</Typography>
              </FlexBetween>
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FlexBetween>
              <Typography>CANCEL</Typography>
            </FlexBetween>
          </IconButton>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;
