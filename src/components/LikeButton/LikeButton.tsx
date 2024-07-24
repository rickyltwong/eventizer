'use client';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type LikeButtonProps = {
  eventId: string;
  status: boolean;
};

const LikeButton = ({ eventId, status }: LikeButtonProps) => {
  const [liked, setLiked] = useState(status);
  const { data: session } = useSession();

  const handleClick = async () => {
    try {
      if (session) {
        if (liked) {
          // Unlike the event
          // setLiked(!liked);
          setLiked(false);

          await axios.delete(`/api/user/${session.user.id}/favourites`, {
            params: { eventId, email: session.user.email },
          });
        } else {
          // Like the event
          // setLiked(!liked);
          setLiked(true);

          await axios.post(`/api/user/${session.user.id}/favourites`, {
            eventId,
            email: session.user.email,
          });
        }
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return liked ? (
    <IconHeartFilled color="red" size="25" onClick={handleClick} />
  ) : (
    <IconHeart color="red" size="25" onClick={handleClick} />
  );
};

export default LikeButton;
