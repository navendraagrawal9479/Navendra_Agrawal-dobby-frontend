import { useTheme } from "@emotion/react";
import { Button, Divider, InputBase } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { ADD_COMMENT_API } from "endpoints";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommentsWidget from "./CommentsWidget";

const MyCommentWidget = ({ _id, postUserId, postId }) => {
  const [comment, setComment] = useState("");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector(state => state.token);
  const user = useSelector(state => state.user);

  const addComment = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}${ADD_COMMENT_API.replace('postId', postId)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: _id,
        postUserId,
        description: comment,
        name: `${user.firstName} ${user.lastName}`,
        location: user.location,
        userPicturePath: user.picturePath
      })
    });

    const data = response.json();

    if(response.ok){
      navigate(0);
      toast.success(data?.message);
    }else{
      toast.error(data?.message);
    }
  }

  return (
    <WidgetWrapper width="100%">
      <FlexBetween flexDirection={'column'} gap = {"1.5rem"} justifyContent={'flex-start'}>
        <InputBase
          placeholder='Add a comment...'
          onChange={(event) => {
            setComment(event.target.value);
          }}
          value={comment}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
          inputProps={{ maxLength: 80 }}
        />
        <Button
          disabled = {!comment}
          onClick = {addComment}
          sx={{
            color: comment ? palette.background.alt : "gray",
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:disabled": {
              backgroundColor: palette.neutral.light
            },
            width: '50%'
          }}
        >
          POST
        </Button>
        <CommentsWidget />
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyCommentWidget;
