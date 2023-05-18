import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { useTheme } from "@emotion/react";
import { Box, Button, Divider, IconButton, InputBase, Typography, LinearProgress } from "@mui/material";
import { CREATE_POST_API, FEED_POSTS_API } from "endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mediumMain = palette.neutral.MediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${CREATE_POST_API}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    const data = await response.json();

    const postsResponse = await fetch(
      `${process.env.REACT_APP_BASE_URL}${FEED_POSTS_API}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const posts = await postsResponse.json();
    dispatch(setPosts({ posts: posts.posts }));
    setImage(null); //reset
    setPost("");
    setIsLoading(false);

    if (response.ok) {
      navigate(0);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <WidgetWrapper mb={2}>
      <FlexBetween gap={"1.5rem"}>
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(event) => {
            setPost(event.target.value);
          }}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius='5px'
          mt='1rem'
          p='1rem'
        >
          <Dropzone
            acceptedFiles='.jpg,.jpeg,.png'
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p='1rem'
                  width={"100%"}
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick = {() => setImage(null)}
                    sx={{width: "15%"}}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{margin: "1.2rem 0"}} />

      <FlexBetween mb={isLoading ? 1 : 0}>
        <FlexBetween gap={"0.25rem"} onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{color: mediumMain}} />
          <Typography
            color = {mediumMain}
            sx={{"&:hover": {cursor: 'pointer', color: medium}}}
          >
            Image
          </Typography>
        </FlexBetween>
        
        <Button
          disabled = {!post || isLoading}
          onClick = {handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:disabled": {
              backgroundColor: palette.neutral.light
            }
          }}
        >
          POST
        </Button>
      </FlexBetween>
      {isLoading && <LinearProgress />}
    </WidgetWrapper>
  );
};

export default MyPostWidget;
