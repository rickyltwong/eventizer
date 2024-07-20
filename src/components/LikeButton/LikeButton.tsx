'use client';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type LikeButtonProps = {
  eventId: string;
};

const LikeButton = ({ eventId }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const { data: session } = useSession();

  const handleClick = async () => {
    try {
      if (session) {
        if (liked) {
          // Unlike the event
          setLiked(!liked);

          await axios.delete(`/api/user/${session.user.id}/favorites`, {
            params: { eventId },
          });
        } else {
          // Like the event
          setLiked(!liked);

          await axios.post(`/api/user/${session.user.id}/favorites`, {
            eventId,
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
