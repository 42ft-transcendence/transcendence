import { ProfileButtonContainer } from "./index.styled";
import { profileRoleButtonMapping } from "./data";
import { useRecoilState } from "recoil";
import {
  addBlock,
  addFriend,
  deleteBlock,
  deleteFriend,
  getBlockList,
  getFriendList,
  offerBattle,
} from "@src/api";
import { useEffect, useState } from "react";
import { RoleType } from "@src/types";
import { IconButton } from "@src/components/buttons";
import { showProfileState, userDataState } from "@src/recoil/atoms/common";

interface ProfileButtonActionsProps {
  role: RoleType; // "self" | "attendee" | "owner" | "admin"
}

interface ProfileButtonProps {
  buttons: { label: string; action: () => void; src: string }[];
}

const ProfileButtons: React.FC<ProfileButtonProps> = ({ buttons }) => {
  return (
    <ProfileButtonContainer>
      {buttons.map((button) => (
        <IconButton
          key={button.label}
          title={button.label}
          theme="LIGHT"
          onClick={button.action}
          iconSrc={button.src}
        />
      ))}
    </ProfileButtonContainer>
  );
};

export const ProfileButtonActions = ({ role }: ProfileButtonActionsProps) => {
  const [myData] = useRecoilState(userDataState);
  // 상대 프로필 유저
  const [user] = useRecoilState(showProfileState);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // 친구 상태인지 확인
  const checkFriend = async (): Promise<void> => {
    try {
      const response = await getFriendList();
      const friendList = response.data;
      console.log("friendList", friendList);
      const isFriend = friendList.some((friend) => friend.id === user.user.id);
      setIsFriend(isFriend);
    } catch (error) {
      console.log(error);
    }
  };

  // 차단 상태인지 확인
  const checkBlock = async (): Promise<void> => {
    try {
      const response = await getBlockList();
      const blockList = response.data;
      const isBlocked = blockList.some((block) => block.id === user.user.id);
      setIsBlocked(isBlocked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFriend = async (): Promise<void> => {
    try {
      const response = await addFriend(user.user.id);
      setIsFriend(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFriend = async (): Promise<void> => {
    try {
      const response = await deleteFriend(user.user.id);
      setIsFriend(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBlock = async (): Promise<void> => {
    try {
      await addBlock(user.user.id);
      setIsBlocked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBlock = async (): Promise<void> => {
    try {
      const response = await deleteBlock(user.user.id);
      setIsBlocked(false);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBattleOffer = async (): Promise<void> => {
    try {
      await offerBattle(user.user.id, myData.nickname);
    } catch (error) {
      console.log(error);
    }
  };

  const profileButtonData = [
    {
      label: "대전 신청",
      action: handleBattleOffer,
      src: "src/assets/icons/battle.svg",
    },
    {
      label: "친구 추가",
      action: handleAddFriend,
      src: "src/assets/icons/addFriend.svg",
    },
    {
      label: "친구 삭제",
      action: handleDeleteFriend,
      src: "src/assets/iconsdeleteFriend.svg",
    },
    {
      label: "차단 하기",
      action: handleAddBlock,
      src: "src/assets/icons/block.svg",
    },
    {
      label: "차단 해제",
      action: handleDeleteBlock,
      src: "src/assets/icons/unblock.svg",
    },
    {
      label: "DM 보내기",
      action: () => console.log("handleActionSendMessage"),
      src: "src/assets/icons/sendMessage.svg",
    },
    {
      label: "전적 보기",
      action: () => console.log("handleActionShowRecord"),
      src: "src/assets/icons/showRecord.svg",
    },
    {
      label: "채팅 금지",
      action: () => console.log("handleActionBanChat"),
      src: "src/assets/icons/banChat.svg",
    },
    {
      label: "채팅 금지 해제",
      action: () => console.log("handleActionUnbanChat"),
      src: "src/assets/icons/unbanChat.svg",
    },
    {
      label: "강제 퇴장",
      action: () => console.log("handleActionKick"),
      src: "src/assets/icons/kick.svg",
    },
    {
      label: "관리자 설정",
      action: () => console.log("handleActionSetAdmin"),
      src: "src/assets/icons/setAdmin.svg",
    },
    {
      label: "관리자 해제",
      action: () => console.log("handleActionUnsetAdmin"),
      src: "src/assets/icons/unsetAdmin.svg",
    },
  ];

  // 초기 상태 설정
  let filteredButtons = profileButtonData.filter((button) =>
    profileRoleButtonMapping[role].includes(button.label),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkFriend();
        await checkBlock();
      } catch (error) {
        console.log(error);
      }
    };

    fetchData().catch((error) => console.log(error));
  }, [isFriend, isBlocked]);

  if (isFriend) {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 추가",
    );
  } else {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 삭제",
    );
  }

  if (isBlocked) {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "차단 하기",
    );
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 추가",
    );
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "친구 삭제",
    );
  } else {
    filteredButtons = filteredButtons.filter(
      (button) => button.label !== "차단 해제",
    );
  }

  return <ProfileButtons buttons={filteredButtons} />;
};
