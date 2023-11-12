import { queryWrapper } from "@/lib";

type TKakaoAddressSearchQuery = {
  query: string;
  analyze_type?: string;
  page?: number;
  size?: number;
};
export const GET_KAKAO_ADDRESS = queryWrapper<TKakaoAddressSearchQuery>(
  "/v2/local/search/address"
);

export type GetResultResponse = { data?: any; message: string; status: number };
export const GET_RESULT = (place: string) => `/api/result/${place}`;
