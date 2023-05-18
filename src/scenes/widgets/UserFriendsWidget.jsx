import { useTheme } from '@emotion/react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { FRIEND_LIST_API } from 'endpoints';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const UserFriendsWidget = ({userId}) => {
  const {palette} = useTheme();
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(state => state.token);

  const getFriends = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}${FRIEND_LIST_API.replace(
        "userId",
        userId
      )}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    setFriends(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, []);

  if (isLoading && friends.length === 0) {
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
  )
}

export default UserFriendsWidget;