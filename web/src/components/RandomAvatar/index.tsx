import axios from "axios";
import { Buffer } from "buffer";
import { Avatar, AvatarProps } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";

export type RandomAvatarProps = Omit<AvatarProps, "img">;

const RandomAvatar: React.FC<RandomAvatarProps> = (props) => {
  const [avatar, setAvatar] = useState<string | null>(null);

  const { isLoading, isPaused, isError, mutate } = useMutation(
    async () => {
      const randomNumber = Math.round(Math.random() * 1000);
      const apiKey = import.meta.env.VITE_API_KEY;
      const apiUrl = `https://api.multiavatar.com/${randomNumber}?apikey=${apiKey}`;

      const { data: image } = await axios.get<string>(apiUrl);

      return image;
    },
    {
      onSuccess: (avatar) => {
        const avatarBuffer = new Buffer(avatar).toString("base64");

        localStorage.setItem("@beachForecast:avatar", avatarBuffer);
        setAvatar(avatarBuffer);
      },
      onError: () => {
        localStorage.removeItem("@beachForecast:avatar");
        setAvatar(null);
      },
    }
  );

  useEffect(() => {
    const avatar = localStorage.getItem("@beachForecast:avatar");

    if (!avatar) {
      mutate();
    } else {
      setAvatar(avatar);
    }
  }, []);

  return isLoading || isPaused || isError || !avatar ? (
    <Avatar {...props} />
  ) : (
    <Avatar {...props} img={`data:image/svg+xml;base64,${avatar}`} />
  );
};

export default RandomAvatar;
