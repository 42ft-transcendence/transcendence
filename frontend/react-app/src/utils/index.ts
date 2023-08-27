import { UserType } from "@src/types";
import { SetterOrUpdater } from "recoil";

type ShowProfilePayload = {
  showProfile: boolean;
  user: UserType;
};

export const ProfileModalOnClickHandler =
  (
    setShowProfile: SetterOrUpdater<ShowProfilePayload>,
    showProfile: boolean,
    user: UserType,
  ) =>
  () => {
    setShowProfile({
      showProfile: showProfile,
      user,
    });
  };
