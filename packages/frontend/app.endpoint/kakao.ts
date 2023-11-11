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
