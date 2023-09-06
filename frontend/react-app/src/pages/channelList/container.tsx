import { useEffect } from "react";
import { getAllChannels } from "@api/chatting";
import ChannelListPageView from "./view";
import { useRecoilState } from "recoil";
import { allChannelListState } from "@src/recoil/atoms/channel";

const ChannelListPageContainer = () => {
  const [channels, setChannels] = useRecoilState(allChannelListState);

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
        channels={channels}
      />
    </>
  );
};

export default ChannelListPageContainer;
