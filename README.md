# Salon-Recommendation

![test1 (1)](https://github.com/HYEOK9/Salon-Recommendation/assets/87190744/efa69731-b2d8-4222-821f-af185676c2d2)
![test2 (1)](https://github.com/HYEOK9/Salon-Recommendation/assets/87190744/89668342-571b-4bc9-a3c5-e7fbc661b811)


원하는 헤어와 가장 유사한 리뷰를 가진 미용실을 추천해주는 어플리케이션

based on

- Monorepo

- Next.js

- Selenium

- [Image Embedding](https://github.com/christiansafka/img2vec)

- [hair segmentation](https://github.com/YBIGTA/pytorch-hair-segmentation)

<br/>

아래와 같이 hair로 추정되는 부분만 crop하여 유사도를 비교합니다.

<img width="555" alt="스크린샷 2023-11-14 오전 12 37 40" src="https://github.com/HYEOK9/Salon-Recommendation/assets/87190744/af2244cc-2443-417d-bade-6472ea9e17e2">

## test in local

1. [chromeDriver](http://chromedriver.storage.googleapis.com/index.html) 설치
2. root경로에 [model](https://drive.google.com/file/d/1w7oMuxckqEClImjLFTH7xBCpm1wg7Eg4/view) 다운 후 추가
3. [카카오 키](https://developers.kakao.com/console/app) 발급 후 ```env/.dev``` 작성 (env/dev.example 참고)
4. ```> $ pip install -r requirements.txt```
5. ```> $ pnpm i```
6. ```> $ pnpm front dev```
4. ```> $ pnpm back dev```

❗️GPU가 없을 시 매우 느립니다.
