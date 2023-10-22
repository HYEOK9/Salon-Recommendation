import chrome from "selenium-webdriver/chrome";

const TEST_MODE = process.env.CRAWLING_NODE_ENV === "development";

const chromeOptions = new chrome.Options().addArguments(
  "--disable-gpu",
  "window-size=1920x1080",
  "lang=ko_KR"
);

if (!TEST_MODE) chromeOptions.addArguments("--headless=new");

// 거리순 정렬하려면 mobile view로 열어야함
const placeResultUrl =
  "https://m.map.naver.com/search2/search.naver?query=%EB%AF%B8%EC%9A%A9%EC%8B%A4&siteSort=1&sm=clk";

const script = {
  scrollBottom: "window.scrollTo(0, document.body.scrollHeight)",
  getScrollY: "return document.body.scrollHeight",
};

const MAX_SALON = Number(process.env.MAX_SALON);
const MAX_IMAGE_LENGTH_PER_SALON = Number(
  process.env.MAX_IMAGE_LENGTH_PER_SALON
);
const SCROLL_TIME = 500;
const SCROLL_TIMEOUT = Number(process.env.SCROLL_TIMEOUT);

type TImage = { placeName: string; src: string };

export {
  TEST_MODE,
  chromeOptions,
  placeResultUrl,
  script,
  MAX_SALON,
  MAX_IMAGE_LENGTH_PER_SALON,
  SCROLL_TIME,
  SCROLL_TIMEOUT,
  TImage,
};
