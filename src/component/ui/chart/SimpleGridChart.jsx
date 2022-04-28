import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import ChartUtil from 'util/ChartUtil';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Wrapper = styled.div`
  width: 100%;
`;

const Veil = styled.div`
  position: absolute;
  visibility: hidden;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.color.WHITE};
  opacity: 0.66;
  z-index: 2;
`;

const LINE_WIDTH = 1;
const X_AXIS_TICK_LENGTH = 15;

function getData(n) {
  var arr = [],
    i,
    a,
    b,
    c,
    spike;

  for (i = 0; i < n; i = i + 1) {
    if (i % 100 === 0) {
      a = 50 * Math.random();
    }
    if (i % 1000 === 0) {
      b = 50 * Math.random();
    }
    if (i % 10000 === 0) {
      c = 50 * Math.random();
    }
    if (i % 50000 === 0) {
      spike = 10;
    } else {
      spike = 0;
    }
    arr.push([
      i,
      (100 * Math.sin(i / 100) + a + b + c + spike + Math.random()) % 1.9,
    ]);
  }
  return arr;
}
var n = 2500,
  sampleData = getData(n);

// https://github.com/highcharts/highcharts-react#options-details
const generateChartOptions = (
  data = [],
  onClickChart,
  isRecommended,
  theme
) => {
  return {
    chart: {
      margin: [0, 0, X_AXIS_TICK_LENGTH, 0],
      // zoomType: 'x',
      panning: true,
      panKey: 'shift',
      plotBorderWidth: 0,
      borderWidth: 0,
      events: {
        click: function (event) {
          if (typeof onClickChart === 'function') onClickChart();
        },
        render: function () {
          const chart = this;
          const renderer = chart.renderer;

          // grid render
          ChartUtil.renderBorderGrid(
            chart,
            X_AXIS_TICK_LENGTH,
            LINE_WIDTH,
            50,
            theme
          );

          // 차트 데이터가 없을 경우 'None Found' 메시지 표시
          if (chart.pointCount === 0) {
            if (chart.customLabel) {
              chart.customLabel.destroy();
            }
            chart.customLabel = renderer
              .label(
                'None Found',
                chart.plotWidth / 2 - 30,
                chart.plotHeight / 2
              )
              .attr({
                zIndex: 5,
                fontWeight: 600,
              })
              .add();
          }
          if (isRecommended) {
            if (chart.recommended) {
              chart.recommended.destroy();
            }
            const { x, y, width, height } = chart.plotBox;

            const strokeWidth = 1.5;
            chart.recommended = renderer
              .rect({
                x: x + strokeWidth / 2,
                y: y + strokeWidth / 2,
                width: width - strokeWidth,
                height: height - strokeWidth,
                zIndex: 4,
                stroke: theme.color.PRIMARY_BLUE,
                'stroke-width': strokeWidth,
              })
              .attr({ className: 'RecommendedGridChart' })
              .add();
          }
        },
      },
    },
    xAxis: {
      minPadding: 0,
      max: 2500,
      tickInterval: 250,
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      labels: {
        enabled: true,
        padding: 0,
        x: 9,
        y: 14,
        style: {
          fontSize: '9px',
          'line-height': '130%',
          fill: theme.color.MEDIUM_DARK,
          color: theme.color.MEDIUM_DARK,
        },
        // 마지막 10초의 라벨은 생략
        formatter: function () {
          return this.value !== 2500 ? `${this.value / 250}s` : '';
        },
      },
    },
    yAxis: {
      // -1 ~ 2 mV 구간을 각 0.5 mV 씩 표현 6개 구간으로 제공
      min: -1,
      max: 2,
      lineWidth: 0,
      tickLength: 0,
      tickAmount: 7,
      gridLineWidth: 0,
      title: {
        enabled: false,
      },
      labels: {
        enabled: false,
      },
    },
    series: [
      {
        data: data,
        lineWidth: LINE_WIDTH,
        color: theme.color.RED,
        pointPlacement: 'on',
        animation: false,
      },
    ],
    title: null,
    boost: {
      useGPUTranslations: true,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
      formatter: function () {
        return `${this.y.toFixed(2)} mV`;
      },
    },
    plotOptions: {
      series: {
        // enableMouseTracking: false   // 모든 마우스 이벤트 제거, performance 향샹 기대 가능하다고 함
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false, // hover 시 마우스 포인터와 가까운 포인트 강조 효과 제거
            },
          },
        },
        states: {
          hover: {
            enabled: true,
            halo: null, // hover 시 마우스 포인터와 가까운 포인트 주변 후광(?) 효과 제거
          },
        },
        animation: false, // animation 제거(렌더 시간 단축!!!)
      },
    },
  };
};

function SimpleGridChart(props) {
  const theme = useTheme();

  const {
    //
    data,
    onClickChart,
    isRecommended,
    width,
  } = props;

  return (
    <Wrapper>
      {/* <Veil className="veil" /> */}
      <HighchartsReact
        highcharts={Highcharts}
        options={generateChartOptions(
          data ?? sampleData,
          onClickChart,
          isRecommended,
          theme
        )}
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[false, false, false]}
        containerProps={{
          className: 'chartContainer',
          style: {
            width,
            height: width * 0.12 + X_AXIS_TICK_LENGTH,
          },
        }}
        callback={(chart) => {}}
      />
    </Wrapper>
  );
}

export default SimpleGridChart;
