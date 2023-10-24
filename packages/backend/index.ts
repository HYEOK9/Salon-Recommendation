import { Builder, By, until } from "selenium-webdriver";
import { PythonShell } from "python-shell";
import {
  TEST_MODE,
  IS_GPU,
  chromeOptions,
  placeResultUrl,
  script,
  MAX_SALON,
  MAX_IMAGE_LENGTH_PER_SALON,
  SCROLL_TIME,
  SCROLL_TIMEOUT,
  SHOW_CLIENT,
} from "./constant";
import { TImage, TResult } from "./type";
import { GetBestCosSimArgs, pythonShellDefaultOptions } from "./pythonConfig";
import { downloadImgFromUrl, isJSONString } from "./util";

const TEST_FILE = "../../data/9.jpeg";
PythonShell.defaultOptions = pythonShellDefaultOptions;

const run = async () => {
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();

  let totalImageList: { placeName: string; images: TImage[] }[] = [];
  let pythonShellPromises: Promise<any>[] = [];
  let preBestReviews: TResult[] = [];

  try {
    // 현재 위치에서 미용실을 검색했을 때 검색 결과
    await driver.get(placeResultUrl);

    await driver.findElement(By.id("_myLocation")).click();

    let currentUrl = await driver.getCurrentUrl();

    console.log("\n위치 가져오는 중...");

    while (currentUrl === (await driver.getCurrentUrl())) {}

    // 현 위치
    let locTextElement = await driver.findElement(By.css("._resultQuery p"));

    await driver.wait(until.elementIsVisible(locTextElement)).catch(() => {});

    console.log(`${await locTextElement.getText()}\n`);

    // 미용실 이름들
    let resultElements = await driver.findElements(
      By.className("_item _lazyImgContainer")
    );

    // 최댓값으로 설정한 만큼의 리뷰들만 가져옴
    resultElements = resultElements.slice(0, MAX_SALON);

    for (const salon of resultElements) {
      // 미용실 이름
      const placeName = await salon.getAttribute("data-title");
      // 미용실 place id
      const sid = await salon.getAttribute("data-sid");
      // 해당 미용실의 방문자 review page로 이동
      await driver
        .navigate()
        .to(
          `https://m.place.naver.com/hairshop/${sid}/photo?filterType=방문자`
        );

      // 방문자 포토리뷰 담고있는 div
      let reviewContainer = await driver.findElements(By.className("Nd2nM"));

      // 리뷰 없으면 뒤로가서 다음 미용실 탐색
      if (!reviewContainer.length) {
        console.log(`review not exists in ${placeName}`);
        await driver.navigate().back();
        continue;
      }

      await driver.wait(until.elementIsVisible(reviewContainer[0]));

      // 현재 보고있는 미용실의 리뷰이미지들 담을 배열
      let imageList: TImage[] = [];

      // 리뷰 페이지 body height
      let prevHeight: number = await driver.executeScript(script.getScrollY);

      while (1) {
        // 페이지에 보이는 모든 리뷰 이미지 요소
        let reviewImages = await driver.findElements(By.className("wzrbN"));

        for (const reviewImage of reviewImages) {
          // 이미 넣은 dataGridGroupKey를 제외하고 리뷰 이미지 배열에 추가\

          let imageElement = await reviewImage.findElement(By.css("a > img"));

          let visitorNumber = await imageElement.getAttribute("id");
          visitorNumber = visitorNumber.slice(
            visitorNumber.lastIndexOf("_") + 1
          );

          if (Number(visitorNumber) <= imageList.length - 1) continue;

          // 미용실의 리뷰가 threshold를 초과한 경우
          if (imageList.length >= MAX_IMAGE_LENGTH_PER_SALON) break;

          let src = await imageElement.getAttribute("src");

          imageList.push({
            fileName: `${placeName}-${imageList.length + 1}`,
            src,
          });
        }

        if (imageList.length >= MAX_IMAGE_LENGTH_PER_SALON) break;

        // // 최초 30개씩 보여주므로 30개 아래면 스크롤할 필요 없음
        if (reviewImages.length < 30) break;

        let curHeight = prevHeight;

        // 더 스크롤 가능한지 검사
        await driver
          .wait(async () => {
            await driver.executeScript(script.scrollBottom);
            await driver.sleep(SCROLL_TIME);

            curHeight = await driver.executeScript(script.getScrollY);

            return prevHeight !== curHeight;
          }, SCROLL_TIMEOUT)
          .catch(() => {});

        // 무한스크롤이 끝난 경우
        if (prevHeight === curHeight) break;

        // 아닐경우 현재 height 갱신
        prevHeight = curHeight;
      }

      // hair segmentation script
      let pythonShell = new PythonShell(
        "get_cos_sim.py",
        GetBestCosSimArgs(IS_GPU, TEST_FILE, imageList)
      );

      const pythonShellPromise = new Promise((resolve) => {
        pythonShell.on("message", (msg) => {
          const value = isJSONString(msg);
          value ? preBestReviews.push(value) : console.log(msg);
        });
        pythonShell.on("error", (err) => console.error(err));

        pythonShell.end(() => resolve(1));
      });

      pythonShellPromises.push(pythonShellPromise);

      totalImageList = [...totalImageList, { placeName, images: imageList }];

      await driver.navigate().back();
    }

    await Promise.all(pythonShellPromises);

    const result = preBestReviews
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, SHOW_CLIENT);

    result.forEach((image) => downloadImgFromUrl(image, "../../result"));
  } catch (e) {
    console.log(e);
  } finally {
    if (!TEST_MODE) driver.quit();
    let totalLength = 0;
    console.log("--------------------------------");
    totalImageList.forEach(({ placeName, images }) => {
      const length = images.length;
      console.log(`${placeName}:${length} 개`);
      totalLength += length;
    });
    console.log(`\nprocessed ${totalLength} images`);
    console.log(`downloaded ${SHOW_CLIENT} images\n`);
    console.timeEnd("running time");
    console.log("--------------------------------");
  }
};

console.time("running time");
run();
