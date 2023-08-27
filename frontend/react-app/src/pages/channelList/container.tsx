import { useEffect, useState } from "react";
import { getAllChannels } from "@api/chatting";
import { ChannelType } from "@type";
import ChannelListPageView from "./view";

const ChannelListPageContainer = () => {
  const [channels, setChannels] = useState<ChannelType[]>([]);

  const handleChannelSearch = (keyword: string) => {
    console.log(keyword);
    getAllChannels()
      .then((response) => {
        setChannels(
          response.data.filter((channel) => channel.name.includes(keyword)),
        );
      })
      .catch((error) => {
        console.log(error);
        setChannels((channels) =>
          channels.filter((channel) => channel.name.includes(keyword)),
        );
      });
  };

  const handleChannelClick = (channel: ChannelType) => {
    console.log(channel);
  };

  useEffect(() => {
    getAllChannels()
      .then((response) => {
        setChannels(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setChannels]);

  return (
    <>
      <ChannelListPageView
        onChannelSearch={handleChannelSearch}
        onChannelClick={handleChannelClick}
        channels={channels}
      />
    </>
  );
};

export default ChannelListPageContainer;
