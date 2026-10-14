import { create } from "zustand";
import {
  UserIcon,
  UserIconBald,
  UserIconBeard,
  UserIconBeeny,
  UserIconBoy,
  UserIconCowBoy,
  UserIconFemale,
  UserIconGirl,
  UserIconMonster,
  UserIconNomad,
  UserIconOld,
  UserIconOldWoman,
  UserIconPatch,
  UserIconPunk,
  UserIconRocky,
  UserIconSardarJi,
} from "../components/Icons.jsx";

const useAvatarStore = create((set, get) => ({
   avatarOptions: [
    {
      id: "UserIconMonster",
      icon: <UserIconMonster size={80} />,
      alt: "Avatar 1",
    },
    { id: "UserIconBeard", icon: <UserIconBeard size={80} />, alt: "Avatar 2" },
    { id: "UserIcon", icon: <UserIcon size={80} />, alt: "Avatar 3" },
    { id: "UserIconBald", icon: <UserIconBald size={80} />, alt: "Avatar 3" },
    { id: "UserIconBeeny", icon: <UserIconBeeny size={80} />, alt: "Avatar 3" },
    { id: "UserIconBoy", icon: <UserIconBoy size={80} />, alt: "Avatar 4" },
    {
      id: "UserIconCowBoy",
      icon: <UserIconCowBoy size={80} />,
      alt: "Avatar 4",
    },
    {
      id: "UserIconFemale",
      icon: <UserIconFemale size={80} />,
      alt: "Avatar 4",
    },
    { id: "UserIconGirl", icon: <UserIconGirl size={80} />, alt: "Avatar 5" },
    { id: "UserIconNomad", icon: <UserIconNomad size={80} />, alt: "Avatar 5" },
    { id: "UserIconOld", icon: <UserIconOld size={80} />, alt: "Avatar 5" },
    {
      id: "UserIconOldWoman",
      icon: <UserIconOldWoman size={80} />,
      alt: "Avatar 6",
    },
    { id: "UserIconPatch", icon: <UserIconPatch size={80} />, alt: "Avatar 6" },
    { id: "UserIconPunk", icon: <UserIconPunk size={80} />, alt: "Avatar 6" },
    { id: "UserIconRocky", icon: <UserIconRocky size={80} />, alt: "Avatar 7" },
    {
      id: "UserIconSardarJi",
      icon: <UserIconSardarJi size={80} />,
      alt: "Avatar 7",
    },
  ],
  avatars: {  
    ["UserIconMonster"]: {
      icon: <UserIconMonster size={40} />,
      alt: "Avatar 1",
    },
    ["UserIconBeard"]: { icon: <UserIconBeard size={40} />, alt: "Avatar 2" },
    ["UserIcon"]: { icon: <UserIcon size={40} />, alt: "Avatar 3" },
    ["UserIconBald"]: { icon: <UserIconBald size={40} />, alt: "Avatar 3" },
    ["UserIconBeeny"]: { icon: <UserIconBeeny size={40} />, alt: "Avatar 3" },
    ["UserIconBoy"]: { icon: <UserIconBoy size={40} />, alt: "Avatar 4" },
    ["UserIconCowBoy"]: { icon: <UserIconCowBoy size={40} />, alt: "Avatar 4" },
    ["UserIconFemale"]: { icon: <UserIconFemale size={40} />, alt: "Avatar 4" },
    ["UserIconGirl"]: { icon: <UserIconGirl size={40} />, alt: "Avatar 5" },
    ["UserIconNomad"]: { icon: <UserIconNomad size={40} />, alt: "Avatar 5" },
    ["UserIconOld"]: { icon: <UserIconOld size={40} />, alt: "Avatar 5" },
    ["UserIconOldWoman"]: {
      icon: <UserIconOldWoman size={40} />,
      alt: "Avatar 6",
    },
    ["UserIconPatch"]: { icon: <UserIconPatch size={40} />, alt: "Avatar 6" },
    ["UserIconPunk"]: { icon: <UserIconPunk size={40} />, alt: "Avatar 6" },
    ["UserIconRocky"]: { icon: <UserIconRocky size={40} />, alt: "Avatar 7" },
    ["UserIconSardarJi"]: {
      icon: <UserIconSardarJi size={40} />,
      alt: "Avatar 7",
    },
  }

}));

export default useAvatarStore;
