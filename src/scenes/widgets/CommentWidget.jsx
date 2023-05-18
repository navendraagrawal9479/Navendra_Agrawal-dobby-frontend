import { useTheme } from "@emotion/react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import UserImage from "components/UserImage";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import Loader from "react-js-loader";
import FlexBetween from "components/FlexBetween";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETE_COMMENT_API } from "endpoints";
import { toast } from "react-toastify";

const CommentWidget = ({
  commentId,
  userId,
  name,
  description,
  location,
  userPicturePath,
  createdAt,
}) => {
  const { palette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const main = palette.neutral.main;
  const navigate = useNavigate();
  const _id = useSelector((state) => state.user._id);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${DELETE_COMMENT_API.replace(
        "commentId",
        commentId
      )}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      navigate(0);
      toast.success("Comment Deleted");
    } else {
      toast.error("An error occured.");
    }
    setIsLoading(false);
  };

  return (
    <Stack
      mb={1}
      p={0}
      sx={{ backgroundColor: palette.background.alt }}
      gap={1}
      alignItems='flex-start'
      justifyContent={"center"}
      width={"100%"}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        gap={1}
        justifyContent={"space-between"}
      >
        <UserImage image={userPicturePath} size={"25px"} />
        <Box
          onClick={() => {
            navigate(`/profile/${userId}`);
            navigate(0); //so that when a user jumps from one profile to another, the page refreshes
          }}
        >
          <Typography
            color={main}
            variant='h6'
            fontWeight={"450"}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
        </Box>
        <Typography color={palette.neutral.medium} sx={{ fontSize: "0.7rem" }}>
          {moment.utc(createdAt).local().startOf("seconds").fromNow()}
        </Typography>
      </Stack>
      <Typography
        color={main}
        sx={{ width: "100%", fontSize: "1rem" }}
        variant='subtitle2'
      >
        {description}
      </Typography>
      {_id === userId &&
        (
          <IconButton
            onClick={() => {
              setIsOpen(true);
            }}
            sx={{ p: 0 }}
          >
            <FlexBetween>
              <DeleteIcon />

              <Typography sx={{ fontSize: "0.7rem" }}>
                DELETE COMMENT
              </Typography>
            </FlexBetween>
          </IconButton>
        )}
      <Dialog fullWidth open={isOpen}>
        <DialogTitle id='alert-delete-title'>Delete Comment?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Click on Confirm to delete your comment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoading ? (
            <Loader
            type='box-up'
            bgColor={palette.neutral.dark}
            color={palette.neutral.dark}
            size={80}
          />
          ) : (
            <IconButton
              onClick={() => {
                handleDelete();
              }}
              sx={{ p: 0 }}
            >
              <FlexBetween>
                <DeleteIcon />

                <Typography sx={{ fontSize: "0.7rem" }}>
                  CONFIRM
                </Typography>
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
    </Stack>
  );
};

export default CommentWidget;
