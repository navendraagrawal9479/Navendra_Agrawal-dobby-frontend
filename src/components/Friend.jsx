import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";
import { ADD_REMOVE_FRIEND_API } from "endpoints";
import { toast } from "react-toastify";
import { useState } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath, size }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [loading, setLoading] = useState(false);

  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  console.log(friends);

  let isFriend = friends?.find((friend) => {
    return friend._id === friendId || friend._id === _id;
  });
  const patchFriend = async () => {
    setLoading(true);
    const endPoint = ADD_REMOVE_FRIEND_API.replace("userId", _id).replace(
      "friendId",
      friendId
    );
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${endPoint}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (response.ok) {
      toast.success(data?.message);
      dispatch(setFriends({ friends: data?.friends }));
    } else {
      toast.error(data?.message);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <FlexBetween>
      <FlexBetween gap='1rem'>
        <UserImage image={userPicturePath} size={size ? size : "55px"} />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0); //so that when a user jumps from one profile to another, the page refreshes
          }}
        >
          <Typography
            color={main}
            variant='h5'
            fontWeight={"500"}
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name?.length >= 15 ? `${name?.slice(0, 15)}...` : name}
          </Typography>
          <Typography color={medium} fontSize={"0.75rem"}>
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {_id !== friendId && (
        <IconButton
          onClick={() => patchFriend()}
          disabled={loading}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined
              sx={{ color: loading ? "gray" : primaryDark }}
            />
          ) : (
            <PersonAddOutlined sx={{ color: loading ? "gray" : primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
