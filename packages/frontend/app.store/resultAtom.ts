import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export type TResult = {
  fileName: string;
  similarity: number;
  src: string;
  salonLink: string;
};

interface IResultAtom {
  keyImage: string;
  result: TResult[];
}

export const resultAtom = atom<IResultAtom | null>({
  key: "resultAtom",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
