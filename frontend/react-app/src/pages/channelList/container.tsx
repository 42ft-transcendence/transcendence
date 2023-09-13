import { useEffect, useState } from "react";
import { getAllChannels } from "@api/chatting";
import ChannelListPageView from "./view";
import { useRecoilState } from "recoil";
import { allChannelListState } from "@src/recoil/atoms/channel";

const ChannelListPageContainer = () => {
  const [channels, setChannels] = useRecoilState(allChannelListState);
  const [filteredChannels, setFilteredChannels] = useState(channels);
  const [sortedChannels, setSortedChannels] = useState(channels);
  const [search, setSearch] = useState<string>("");
  const [sortState, setSortState] = useState<string>("채널 이름 순");

  useEffect(() => {
    setFilteredChannels(
      channels.filter((channel) => channel.name.includes(search)),
    );
  }, [channels, search]);

  useEffect(() => {
    if (sortState === "채널 이름 순") {
      setSortedChannels(
        [...filteredChannels].sort((a, b) => a.name.localeCompare(b.name)),
      );
    } else if (sortState === "채널 인원 순") {
      setSortedChannels(
        [...filteredChannels].sort((a, b) =>
          !b.participants || !a.participants
            ? 0
            : b.participants?.length - a.participants?.length,
        ),
      );
    }
  }, [filteredChannels, sortState]);

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
        searchBar={{
          id: "channelListSearch",
          search,
          setSearch,
          sortState,
          setSortState,
          sortOptions: ["채널 이름 순", "채널 인원 순"],
          placeholder: "채널 이름을 입력하세요",
        }}
        channels={sortedChannels}
      />
    </>
  );
};

export default ChannelListPageContainer;
