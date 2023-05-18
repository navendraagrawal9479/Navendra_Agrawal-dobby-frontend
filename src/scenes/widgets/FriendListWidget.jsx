import { useTheme } from "@emotion/react";
import { Stack, Typography } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { FRIEND_LIST_API } from "endpoints";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const location = useLocation();
  const isProfile = location.pathname.includes("profile");
  const token = useSelector((state) => state.token);
  const _id = useSelector((state) => state.user._id);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${FRIEND_LIST_API.replace(
        "userId",
        _id
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
      getFriends();
    }
  }, []);

  return (
    <WidgetWrapper>
      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography
          color={palette.neutral.dark}
          fontWeight={550}
          variant='h5'
          sx={{ mb: "1.5rem" }}
        >
          Friends List
        </Typography>
        <Typography
          color={palette.neutral.dark}
          variant='h6'
          sx={{ mb: "1.5rem" }}
        >
          {friends?.length} friends
        </Typography>
      </Stack>

      <Stack gap={1.5}>
        {friends?.length > 0 &&
          friends?.map((friend) => {
            return (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            );
          })}
      </Stack>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
