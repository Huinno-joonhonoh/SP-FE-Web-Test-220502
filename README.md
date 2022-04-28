## 휴이노 FE 신규 개발자를 위한 코드 테스트 가이드

주어진 sample.json 파일의 데이터를 시각화 하는 페이지를 개발해 주세요.

### 목표

**_아래 Figma 를 확인하고 동일한 구성의 신규 페이지를 작성 후 신규 URL(/test-result) 에 할당 합니다._**

- Figma 에 로그인한 후 아래 URL 을 확인하세요.

[Huinno 코딩 테스트 디자인](https://www.figma.com/file/CyEw7pRyw1cC26O52wOBfD/HUINNO-%EC%BD%94%EB%94%A9-%ED%85%8C%EC%8A%A4%ED%8A%B8?node-id=0%3A1)

### 데이터 설명

- 파일은 `src/static/sample.json` 경로에 있습니다.
- 데이터 포인트는 총 2,500 개 포인트이며, 1초의 250 개 데이터 포인트로 구성된 10초 간의 시계열 데이터 입니다.
- X 축은 시작시간을 0초로 하여 10초 까지 표현합니다.
- Y 축은 -1 ~ 2 의 구간 내에서 표현합니다.
- Figma 에서 보여지는 목업과 실제 시각화 된 결과는 다를 수 있습니다.

### 제출 방식

- 정해진 기한까지 목표를 달성한 소스코드를 Github Private 저장소로 구성해서 컨택포인트(email)로 URL 을 공유해 주세요.
  - 중간의 작업 과정을 Commit 으로 기록해 주세요.
  - README 에 다음의 내용을 작성하세요.
    1. 목표 화면이 실행된 브라우저에 접속 URL과 PC의 시간이 보이는 화면 캡쳐 이미지
    2. 과제를 진행하면서 해결하기 어려웠던 부분과 해결과정
    3. 그 외, 아무 코멘트(_없다면 생략 가능_)
    4. 과제를 진행하면 레퍼런스한 웹 페이지 목록(_없다면 생략 가능_)
  - 이메일에는 지원자 성함과 저장소 URL 을 작성해 주세요.
- 작업이 완료된 저장소에 멤버로 다음의 Github 계정을 추가하세요.
  - `Huinno-joonhonoh`
  - 과제 완료 후 저장소에 초대하세요.

### 참고자료

- Highcharts 라인 차트 구현 샘플: https://www.highcharts.com/demo/line-boost
- HighchartsReact 를 사용한 React App. 샘플: https://github.com/highcharts/highcharts-react#readme

### 제약사항

- 소스코드 파일 트리를 유지하세요.
  - 추가로 불필요한 폴더를 구성해서 풀이코드를 작성하지 마세요.
- 사용하는 라이브러리를 변경하지 마세요.
  - 버전 및 구성 변경은 정당한 사유가 없는한 불허 합니다.
- 그 외, 문의사항은 즉시 질문하세요.
  - 연락 드린 컨택포인트를 사용하시면 됩니다.

### 개발환경

| 환경명                    | 버전     |
| ------------------------- | -------- |
| Node.js                   | v16.13.1 |
| React.js                  | v17.0.2  |
| react-router              | v5.3.1   |
| Highcharts                | v9.3.3   |
| highcharts-react-official | v3.1.0   |

### FAQ

- sample.json 파일은 어디에 있나요?
  - `src/static/sample.json` 경로에 있습니다.
- JSX 에서 Highcharts.js 를 import 는 어떻게 하나요?
  - `src/component/ui/chart/SimpleGridChart.jsx` 파일 또는 HighchartsReact 를 사용한 React App. 샘플을 참고하시면 됩니다.
