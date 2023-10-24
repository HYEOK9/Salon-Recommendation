# Salon-Recommendation

근처 미용실의 리뷰이미지로부터 원하는 헤어와 가장 유사한 리뷰를 가진 미용실을 추천해주는 어플리케이션

based on

- Monorepo

- Next.js

- Selenium

- [Image Embedding](https://github.com/christiansafka/img2vec)

- [hair segmentation](https://github.com/YBIGTA/pytorch-hair-segmentation)

<br/>

## test in local

1. [chromeDriver](http://chromedriver.storage.googleapis.com/index.html) 설치

2. root경로에 [model](https://drive.google.com/file/d/1w7oMuxckqEClImjLFTH7xBCpm1wg7Eg4/view) 다운 후 추가

3. packages/backend/index.ts의 TEST_FILE 변수에 원하는 헤어이미지의 경로를 추가 ex) ```const TEST_FILE = "./hair.jpeg"```

4. ```> $ pip install -r requirements.txt```

5. ```> $ pnpm i && pnpm back dev```
