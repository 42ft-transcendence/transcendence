import ChannelSearchItem from "@src/components/channel/channelSearchItem";
import SearchBar from "@src/components/common/searchBar";
import { ChannelType } from "@src/types";

const ex_channel: ChannelType = {
  id: "1",
  name: "test",
  type: "PUBLIC",
  password: "",
  participants: [],
  createdAt: new Date(),
  ownerId: "sangkkim",
};

const ChannelList = () => {
  const handleSearch = (keyword: string) => {
    console.log(keyword);
  };

  const handleChannelClick = (channel: ChannelType) => {
    console.log(channel);
  };

  return (
    <div>
      <h1>Channel List</h1>
      <SearchBar onSearch={handleSearch} />
      <ChannelSearchItem channel={ex_channel} onClick={handleChannelClick} />
    </div>
  );
};

export default ChannelList;
