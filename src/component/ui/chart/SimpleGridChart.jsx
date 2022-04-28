import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import ChartUtil from 'util/ChartUtil';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Wrapper = styled.div`
  width: 100%;
`;

const LINE_WIDTH = 1;
const X_AXIS_TICK_LENGTH = 15;

// https://github.com/highcharts/highcharts-react#options-details
/**
 *
 * @param {array} data
 * @param {function} onClickChart
 * @param {boolean} isRecommended
 * @param {DefaultTheme} theme
 * @returns
 */
const generateChartOptions = (data, onClickChart, theme) => {
  return {
    chart: {
      margin: [
        LINE_WIDTH,
        LINE_WIDTH,
        LINE_WIDTH + X_AXIS_TICK_LENGTH,
        LINE_WIDTH,
      ],
      // zoomType: 'x',
      // panning: true,
      // panKey: 'shift',
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

          // 차트 데이터가 없을 경우 'No Data' 메시지 표시
          if (!data?.length) {
            if (chart.customLabel) {
              chart.customLabel.destroy();
            }
            chart.customLabel = renderer
              .label('No Data', chart.plotWidth / 2 - 30, chart.plotHeight / 2)
              .attr({
                zIndex: 5,
                fontWeight: 600,
              })
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
        color: theme.color.BLACK,
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
    chartWidth,
    chartHeight,
    data,
    onClickChart,
  } = props;

  const chart = useMemo(
    () => (
      <HighchartsReact
        highcharts={Highcharts}
        options={generateChartOptions(data, onClickChart, theme)}
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[false, false, false]}
        containerProps={{
          className: 'chartContainer',
          style: {
            width: chartWidth,
            height: chartHeight ?? chartWidth * 0.12 + X_AXIS_TICK_LENGTH,
          },
        }}
        callback={(chart) => {}}
      />
    ),
    [chartWidth, chartHeight, data]
  );

  return <Wrapper>{chart}</Wrapper>;
}

export default SimpleGridChart;
