import React from 'react';
import styled from 'styled-components';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';

// init the module
HighchartsMore(Highcharts);

const Wrapper = styled.div`
  width: 100%;
  /* display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start; */
`;

const LegendItemContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: align-items;
  & > * {
    :not(:last-child) {
      margin-right: 24px;
    }
  }
`;

const LegendItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LegendItemCircle = styled.div`
  ${(props) => `
        width: ${props.size}px;
        height: ${props.size}px;
        border-radius: ${props.size}px;
        background-color: ${props.color};
        ${
          props.diagonal &&
          `
            background: repeating-linear-gradient(
                -45deg,
                ${props.color},
                ${props.color} 1px,
                #ffffff 1px,
                #ffffff 3px
            );
            `
        };
        ${
          props.showBorder &&
          `
            border: 1px solid #c7ced2;
        `
        };
    `}
`;

const LegendItemText = styled.div`
  margin-left: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #242626;
`;

function LegendItem(props) {
  return (
    <LegendItemWrapper>
      <LegendItemCircle
        size={props.size}
        color={props.color}
        diagonal={props.diagonal}
        showBorder={props.showBorder ?? true}
      />
      <LegendItemText>{props.title}</LegendItemText>
    </LegendItemWrapper>
  );
}

const generateSampleData = () => {
  let data = [];
  for (var i = 0; i < 100; i++) {
    let min = 50 + 80 * Math.random();
    let max = min + 50;
    let median = (min + max) / 2;
    data.push([min, median, max]);
  }

  return data;
};

Highcharts.seriesType(
  'lowmedhigh',
  'boxplot',
  {
    keys: ['low', 'median', 'high'],
    tooltip: {
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> {series.name}: ' +
        'Low <b>{point.low}</b> - Median <b>{point.median}</b> - High <b>{point.high}</b><br/>',
    },
  },
  {
    drawPoints: function () {
      var series = this;
      const r = 2;

      this.points.forEach(function (point) {
        var graphic = point.graphic;
        var verb = graphic ? 'animate' : 'attr';
        var shapeArgs = point.shapeArgs;
        var width = shapeArgs.width;
        var left = shapeArgs.x;
        var crispX = left + Math.round(width / 2);
        var highPlot = Math.floor(point.highPlot);
        var medianPlot = Math.floor(point.medianPlot);
        // Sneakily draw low marker even if 0
        var lowPlot =
          Math.floor(point.lowPlot) + 0.5 - (point.low === 0 ? 1 : 0);

        if (point.isNull) {
          return;
        }

        if (!graphic) {
          point.graphic = graphic = series.chart.renderer
            .path('point')
            .add(series.group);
        }

        graphic
          .attr({
            stroke: '#797979',
            'stroke-width': 3,
            'stroke-linecap': 'round',
          })
          .on('mouseover', () => {
            graphic.attr({
              stroke: '#6881ff',
            });
          })
          .on('mousedown', (event) => {
            event.preventDefault();
            graphic.attr({
              stroke: '#3656ff',
            });
          })
          .on('mouseout', () => {
            graphic.attr({
              stroke: '#797979',
            });
          });

        // prettier-ignore
        graphic[verb]({
                    d: [
                        // Draw circle
                        'M', crispX - r, medianPlot,
                        'a', r,r, 0, 1,0, (r * 2),0,
                        'a', r,r, 0, 1,0, -(r * 2),0,
                        // Draw line
                        'M', crispX, highPlot,
                        'V', lowPlot
                    ]
                });
      });
    },
  }
);

const options = {
  chart: {
    type: 'lowmedhigh',
    height: 240,
    zoomType: 'x',
    panning: true,
    panKey: 'shift',
    scrollablePlotArea: {
      minWidth: 2000,
      scrollPositionX: 0,
    },
    plotBorderColor: '#c7ced2',
    plotBorderWidth: 1,
    borderColor: '#c7ced2',
    borderWidth: 1,
    borderRadius: 8,
  },
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
  xAxis: [
    {
      tickInterval: 9,
      gridLineColor: '#c5c5c5',
      gridLineWidth: 1,
      // https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/
      gridLineDashStyle: 'Dash',
      plotBands: [
        { from: 0, to: 10, color: 'rgba(255, 199, 0, 0.15)' },
        { from: 20, to: 30, color: 'rgba(255, 199, 0, 0.15)' },
        { from: 50, to: 70, color: 'rgba(255, 199, 0, 0.15)' },
      ],
    },
    {
      linkedTo: 0,
      opposite: true,
      tickInterval: 3,
      labels: {
        format: '{value}',
        style: {
          color: '#000000',
        },
      },
    },
  ],
  yAxis: [
    {
      min: 0,
      max: 200,
      gridLineWidth: 0,
      title: {
        enabled: false,
      },
      labels: {
        enabled: true,
      },
    },
  ],
  series: [
    {
      data: generateSampleData(),
      dataLabels: {
        enabled: true,
        color: '#000000',
      },
    },
  ],
};

// Remove click events on container to avoid having "clickable" announced by AT
// These events are needed for custom click events, drag to zoom, and navigator
// support.
// chart.container.onmousedown = null;
// chart.container.onclick = null;

function ECGDataChart(props) {
  return (
    <Wrapper>
      <LegendItemContainer>
        <LegendItem
          size={12}
          color={'rgba(255, 199, 0, 0.15)'}
          title={'Asleep'}
        />

        <LegendItem
          size={12}
          color={'#cccccc'}
          diagonal={true}
          title={'Taken off'}
        />

        <LegendItem
          size={6}
          color={'#3656ff'}
          showBorder={false}
          title={'Includes patient-triggered data'}
        />
      </LegendItemContainer>

      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[false, false, false]}
        containerProps={{ className: 'chartContainer' }}
        callback={(chart) => {}}
      />
    </Wrapper>
  );
}

export default ECGDataChart;
