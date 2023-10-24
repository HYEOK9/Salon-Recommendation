import chrome from "selenium-webdriver/chrome";

export const TEST_MODE = process.env.CRAWLING_NODE_ENV === "development";
export const IS_GPU = process.env.IS_GPU === "true";
export const MAX_SALON = Number(process.env.MAX_SALON);
export const MAX_IMAGE_LENGTH_PER_SALON = Number(
  process.env.MAX_IMAGE_LENGTH_PER_SALON
);
export const SCROLL_TIME = 500;
export const SCROLL_TIMEOUT = Number(process.env.SCROLL_TIMEOUT);
export const SHOW_CLIENT = Number(process.env.SHOW_CLIENT);

export const chromeOptions = new chrome.Options().addArguments(
  "--disable-gpu",
  "window-size=1920x1080",
  "lang=ko_KR"
);

if (!TEST_MODE) chromeOptions.addArguments("--headless=new");

// 거리순 정렬하려면 mobile view로 열어야함
export const placeResultUrl =
  "https://m.map.naver.com/search2/search.naver?query=%EB%AF%B8%EC%9A%A9%EC%8B%A4&siteSort=1&sm=clk";

export const script = {
  scrollBottom: "window.scrollTo(0, document.body.scrollHeight)",
  getScrollY: "return document.body.scrollHeight",
};
