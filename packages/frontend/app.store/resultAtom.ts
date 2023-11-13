import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

interface IResultAtom {
  keyImage: Blob;
  result: { src: string; placeName: string }[];
}

export const resultAtom = atom<IResultAtom | null>({
  key: "resultAtom",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
