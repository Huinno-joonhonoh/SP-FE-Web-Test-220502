import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import DateUtil from 'util/DateUtil';
// import AppColors from 'theme/AppColors';
import { ReactComponent as NightIcon } from 'static/icon/icon-night.svg';
import Const from 'constant/Const';

// init the module
HighchartsMore(Highcharts);

const SCROLL_BAR_WIDTH = 16;
const LINE_WIDTH = 1;
const X_AXIS_TICK_LENGTH = 15;
const Y_AXIS_WIDTH = 22;
const X_AXIS_WIDTH = 14;
const ICON_NIGHT_SVG_PATH =
  'M10.118 15.833a5.833 5.833 0 1 0 0-11.666 5.833 5.833 0 0 0 0 11.666zm-1.172-9.15a.244.244 0 0 1 .31.318c-.134.332-.201.697-.201 1.084 0 1.593 1.473 3.069 3.067 3.069a2.9 2.9 0 0 0 1.085-.204.243.243 0 0 1 .32.31c-.487 1.315-1.768 2.073-3.222 2.073a3.434 3.434 0 0 1-3.43-3.432c0-1.454.756-2.731 2.07-3.219z';
const PATTERN_DIAGONAL_STRIPE =
  '<pattern id="pattern_6mHrw" patternUnits="userSpaceOnUse" width="3.5" height="3.5" patternTransform="rotate(45)"><line x1="0" y="0" x2="0" y2="3.5" stroke="#E6EAEC" stroke-width="1" /></pattern>';

const Wrapper = styled.div`
  width: calc(${(props) => props.width}px - 40px - 40px);
  margin: 17px 40px 23px 40px;
  padding: 0 0 0 0;
  & .huinno-hr-chart-container {
    .highcharts-plot-band.pb-huinno {
      fill: transparent;
    }
    .highcharts-plot-band.pb-huinno:hover,
    .highcharts-plot-band.pb-huinno.pb-huinno-sleep:hover {
      fill: ${(props) => props.theme.color.MEDIUM_TRANS};
    }
    .highcharts-plot-band.pb-huinno.pb-huinno-sleep {
      fill: url(#pattern_6mHrw);
    }
    // .highcharts-plot-band.pb-huinno.pb-huinno-sleep:hover {
    //   fill: ${(props) => props.theme.color.LIGHT_VIOLET_HOVER};
    // }
    .highcharts-plot-band.pb-huinno.pb-is-on {
      fill: ${(props) => props.theme.color.LIGHT_PRIMARY_BLUE};
    }
  }
`;

let heartRateChart = null;

const generateChartOptions = (heartRatePoints, plotBands, theme, plotWidth) => {
  return {
    chart: {
      // panning: true,
      // panKey: 'shift',
      margin: [
        LINE_WIDTH + X_AXIS_WIDTH,
        LINE_WIDTH,
        LINE_WIDTH + X_AXIS_WIDTH + SCROLL_BAR_WIDTH,
        LINE_WIDTH + Y_AXIS_WIDTH,
      ],
      scrollablePlotArea: {
        minWidth: plotWidth,
        scrollPositionX: 0,
      },
      plotBorderColor: theme.color.MEDIUM,
      plotBorderWidth: LINE_WIDTH,
      animation: false,
      events: {
        click: function (event) {},
        load: function () {},
        render: function () {
          const chart = this;
          // 차트의 SVG 요소에서 사용할 배경 추가, 수면 구간에서 사용
          chart.renderer.defs.element.innerHTML = `${chart.renderer.defs.element.innerHTML}${PATTERN_DIAGONAL_STRIPE}`;
          const renderer = chart.renderer;
          const { x, y, width, height } = chart.plotBox;

          // 차트의 스크롤 SVG 요소의 Border 스타일링 요소
          if (chart.huinnoBorderDeco) {
            chart.huinnoBorderDeco.destroy();
          }
          chart.huinnoBorderDeco = renderer
            .g()
            .attr({ className: 'huinno-chart-border-deco-g', zIndex: 3 })
            .add();

          renderer
            .path([
              'M',
              x - Y_AXIS_WIDTH - LINE_WIDTH,
              y - LINE_WIDTH / 2,
              'H',
              width + Y_AXIS_WIDTH + LINE_WIDTH * 2,
              'M',
              x - Y_AXIS_WIDTH - LINE_WIDTH,
              y + height + LINE_WIDTH / 2,
              'H',
              width + Y_AXIS_WIDTH + LINE_WIDTH * 2,
              'M',
              x - LINE_WIDTH / 2,
              y - LINE_WIDTH - X_AXIS_WIDTH,
              'V',
              height + X_AXIS_WIDTH * 2 - LINE_WIDTH * 2 + 4,
              'M',
              x + width + LINE_WIDTH / 2,
              y - LINE_WIDTH - X_AXIS_WIDTH,
              'V',
              height + X_AXIS_WIDTH * 2 - LINE_WIDTH * 2 + 4,
              'Z',
            ])
            .attr({
              className: 'huinno-chart-borde',
              stroke: theme.color.MEDIUM,
              'stroke-width': LINE_WIDTH,
            })
            .add(chart.huinnoBorderDeco);
          renderer
            .rect({
              x,
              y: y - LINE_WIDTH - X_AXIS_WIDTH,
              width,
              height: X_AXIS_WIDTH,
            })
            .attr({
              fill: theme.color.LIGHT,
            })
            .add(chart.huinnoBorderDeco);
          renderer
            .rect({
              x,
              y: y + height + LINE_WIDTH,
              width,
              height: X_AXIS_WIDTH,
            })
            .attr({
              fill: theme.color.LIGHT,
            })
            .add(chart.huinnoBorderDeco);

          if (chart.huinnoSleepSign) {
            chart.huinnoSleepSign.destroy();
          }
          chart.huinnoSleepSign = renderer
            .g()
            .attr({
              className: 'huinno-chart-symbol-g',
              zIndex: 6,
            })
            .add();

          // 차트의 고정 SVG 요소의 Y 축 스타일링 요소
          document
            .querySelector('.highcharts-scrollable-mask')
            .setAttribute('fill-opacity', 1);
          const fixedChart = document.querySelector('.highcharts-fixed svg');
          let fixedChartDeco = document.querySelector(
            '.highcharts-fixed svg .huinno-chart-deco-g'
          );
          if (fixedChartDeco) fixedChartDeco.remove();
          fixedChartDeco = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'g'
          );
          fixedChartDeco.setAttribute('class', 'huinno-chart-deco-g');
          fixedChartDeco.setAttribute('data-z-index', 3);
          fixedChart.append(fixedChartDeco);
          const fixedChartDecoPath = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          );
          fixedChartDecoPath.setAttribute(
            'd',
            [
              'M',
              x - Y_AXIS_WIDTH - LINE_WIDTH,
              y - LINE_WIDTH / 2,
              'H',
              Y_AXIS_WIDTH + LINE_WIDTH,
              'M',
              x - Y_AXIS_WIDTH - LINE_WIDTH,
              y + height + LINE_WIDTH / 2,
              'H',
              Y_AXIS_WIDTH + LINE_WIDTH,
              'M',
              x - LINE_WIDTH / 2,
              y - LINE_WIDTH - X_AXIS_WIDTH,
              'V',
              height + X_AXIS_WIDTH * 2 - LINE_WIDTH * 2 + 4,
              'Z',
            ].join(' ')
          );
          fixedChartDecoPath.setAttribute('stroke', theme.color.MEDIUM);
          fixedChartDecoPath.setAttribute('stroke-width', LINE_WIDTH);
          fixedChartDeco.append(fixedChartDecoPath);

          for (let i = 0; i < plotBands.length; i++) {
            if (
              !(
                plotBands[i - 1]?.className.includes('pb-huinno-sleep') ?? false
              ) &&
              plotBands[i].className.includes('pb-huinno-sleep')
            ) {
              // console.log(plotBands[i].className);
              chart.huinnoSleepSign.renderer
                .path()
                .attr({
                  d: ICON_NIGHT_SVG_PATH,
                  'fill-rule': 'evenodd',
                  'clip-rule': 'evenodd',
                  transform:
                    'translate(' +
                    (x + 29 + 29 * i + 0.17 * i + 2.6) +
                    ',' +
                    (y + 3) +
                    ')',
                  fill: '#6100FF',
                })
                .add();
            }
          }
        },
      },
    },
    xAxis: [
      {
        tickInterval: 60 * 60 * 1000, // 1시간 === 3600초
        tickLength: 0,
        gridLineColor: theme.color.MEDIUM_LIGHT,
        gridLineWidth: LINE_WIDTH,
        // https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/
        gridLineDashStyle: 'Dash',
        plotBands,
        labels: {
          enabled: true,
          padding: 0,
          y: 10,
          align: 'left',
          // rotation: 0,
          style: {
            fontSize: '8px',
            'line-height': '130%',
            color: theme.color.BLACK,
          },
          formatter: function () {
            const { tickPositions } = this.axis;
            const tickIndex = tickPositions.indexOf(this.value);

            const currentDate = new Date(this.value);
            if (tickIndex > 0) {
              const prevValue = tickPositions[tickIndex - 1];
              const prevDate = new Date(prevValue);

              if (currentDate.getDay() === prevDate.getDay()) {
                return null;
              }
            }

            return DateUtil.format(currentDate, 'MM-dd');
          },
        },
      },
      {
        opposite: true,
        linkedTo: 0,
        tickInterval: 3 * 60 * 60 * 1000, // 3시간 === 10800초
        tickLength: 0,
        gridLineColor: theme.color.MEDIUM,
        gridLineWidth: LINE_WIDTH,
        gridLineDashStyle: 'Dash',
        labels: {
          enabled: true,
          padding: 0,
          y: -5,
          align: 'left',
          style: {
            fontSize: '8px',
            'line-height': '130%',
            color: theme.color.BLACK,
          },
          formatter: function () {
            return DateUtil.formatHourOnly(new Date(this.value));
          },
        },
      },
    ],
    yAxis: [
      {
        min: 0,
        max: 200,
        tickInterval: 50,
        gridLineWidth: 0,
        title: {
          enabled: false,
        },
        labels: {
          enabled: true,
          align: 'right',
          x: -4,
          y: 8,
          style: {
            fontSize: '8px',
            'line-height': '125%',
            color: theme.color.BLACK,
          },
          formatter: function () {
            return this.value === 0 ? 'bpm' : this.value;
          },
        },
      },
    ],
    series: [
      {
        data: heartRatePoints,
        lineWidth: LINE_WIDTH,
        color: theme.color.DARK,
        animation: false,
      },
    ],
    boost: {
      useGPUTranslations: true,
    },
    title: null,
    tooltip: {
      enabled: false,
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
    plotOptions: {
      series: {
        enableMouseTracking: false,
        marker: {
          enabled: false,
          fillColor: theme.color.PRIMARY_BLUE,
          radius: 2.5,
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
        turboThreshold: 0,
      },
    },
  };
};

// Remove click events on container to avoid having "clickable" announced by AT
// These events are needed for custom click events, drag to zoom, and navigator
// support.
// chart.container.onmousedown = null;
// chart.container.onclick = null;

function HeartRateChart(props) {
  const theme = useTheme();

  const {
    chartWarpperWidth,
    chartWrapperHeight,
    heartRatePoints,
    hourlyBands,
    hrHighlightTimestamp,
    setHrHighlight,
  } = props;

  const [navigatedBand, setNavigatedBand] = useState(null);

  const { plotBands, plotWidth } = useMemo(
    () => ({
      plotBands: hourlyBands.map((element) => ({
        ...element,
        zIndex: 5,
        events: {
          click: (event) => {
            setHrHighlight(element.from);
          },
        },
      })),
      plotWidth: hourlyBands.length * 30,
    }),
    [hourlyBands]
  );

  /** !!!매우 중요!!! */
  const hrvHighcharts = useMemo(() => {
    console.log({ plotBands, theme, plotWidth });
    return (
      <HighchartsReact
        containerProps={{
          className: 'huinno-hr-chart-container',
          style: {
            // 화면에서 제공할 너비 높이
            width: chartWarpperWidth - 40 - 40,
            height: chartWrapperHeight - 17 - 23,
          },
        }}
        highcharts={Highcharts}
        options={generateChartOptions(
          heartRatePoints,
          plotBands,
          theme,
          plotWidth
        )}
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[false, false, false]}
        callback={(chart) => {
          heartRateChart = chart;
        }}
      />
    );
  }, [plotBands, plotWidth]);

  useEffect(() => {
    if (heartRateChart) {
      heartRateChart.redraw();
    }
  }, [chartWarpperWidth]);

  useEffect(() => {
    navigateTime();
  }, [hrHighlightTimestamp]);

  const navigateTime = () => {
    if (!hrHighlightTimestamp) return;
    let plotBand = null;
    for (plotBand of plotBands) {
      if (
        hrHighlightTimestamp >= plotBand.from &&
        hrHighlightTimestamp < plotBand.to
      ) {
        break;
      }
    }
    if (plotBand) {
      const newPlotBandClass = `.${plotBand.className.split(' ').join('.')}`;
      let $plotBand = document.querySelector(newPlotBandClass);
      if ($plotBand) {
        $plotBand.classList.add('pb-is-on');
      }
      if (navigatedBand) {
        $plotBand = document.querySelector(navigatedBand);
        $plotBand?.classList.remove('pb-is-on');
      }
      setNavigatedBand(newPlotBandClass);
    }
  };

  return <Wrapper width={chartWarpperWidth}>{hrvHighcharts}</Wrapper>;
}

export default HeartRateChart;
