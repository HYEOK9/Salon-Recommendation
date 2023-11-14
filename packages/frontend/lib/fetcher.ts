import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const errorInterceptor = (error: AxiosError | Error) => {
  if (Axios.isAxiosError(error)) {
    const { message, config, response } = error;
    const { method, url } = config as AxiosRequestConfig;
    const { status, statusText } = response as AxiosResponse;

    console.log(`⛔️ [API] ${method?.toUpperCase()} ${url}`);
    console.log(`Error ${status}${statusText || ""}: ${message}`);
  } else console.log(`⛔️ [API] Error ${error.message}`);
  return Promise.reject(error);
};

const setInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => config);
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    errorInterceptor
  );

  return instance;
};

const kakaoConfig: AxiosRequestConfig = {
  baseURL: "https://dapi.kakao.com",
};

const axiosConfig: AxiosRequestConfig = {
  baseURL: "http://localhost:3001",
};

export const kakaoAxios = setInterceptor(Axios.create(kakaoConfig));
export const axios = setInterceptor(Axios.create(axiosConfig));

kakaoAxios.defaults.headers.Authorization = `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_KEY}`;
