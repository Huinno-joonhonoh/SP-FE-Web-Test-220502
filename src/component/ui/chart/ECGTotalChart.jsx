import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClassLabel from '../label/ClassLabel';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AppColors from 'theme/AppColors';
import { DIAGNOSIS_TYPE } from 'util/ClassLabelUtil';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  :first-child {
    margin-top: 8px;
  }
`;

const ClassContainer = styled.div`
  display: flex;
  padding: 0 10px 8px 10px;
  height: 20px;
`;

const ClassSubContainer = styled.div`
  flex: 1;
  position: relative;
`;

const LabelContainer = styled.div`
  position: absolute;
  right: 8px;
  top: 14px;
  z-index: 1;
`;

const TimeText = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: #242626;
  z-index: 1;
  position: absolute;
  top: 20px;
`;

const MAJOR_TICK_COLOR = AppColors.MEDIUM;
const MINOR_TICK_COLOR = AppColors.MEDIUM_LIGHT;

// https://github.com/highcharts/highcharts-react#options-details
const generateChartOptions = (height, data = []) => {
  return {
    chart: {
      height: height + 45.6, // Add 25px (margin)
      plotBorderColor: MAJOR_TICK_COLOR,
      plotBorderWidth: 1,
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
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      minPadding: 0,
      maxPadding: 0,
      max: 7500,
      tickLength: 0,
      tickInterval: 2500,
      tickColor: MAJOR_TICK_COLOR,
      minorTickInterval: 50,
      minorTickColor: MINOR_TICK_COLOR,
      lineColor: MAJOR_TICK_COLOR,
      gridLineColor: MAJOR_TICK_COLOR,
      gridLineWidth: 1,
      labels: {
        padding: 0,
        enabled: false,
      },
    },
    yAxis: {
      min: -1,
      max: 2,
      tickmarkPlacement: 'on',
      // tickInterval: 0.5,
      tickAmount: 7,
      tickColor: MINOR_TICK_COLOR,
      gridLineColor: MINOR_TICK_COLOR,
      gridLineWidth: 1,
      title: {
        enabled: false,
      },
      labels: {
        padding: 0,
        enabled: false,
      },
    },
    series: [
      {
        data: data,
        lineWidth: 1,
        color: '#ff0000',
        pointPlacement: 'on',
      },
    ],
    plotOptions: {
      series: {
        enableMouseTracking: false, // 모든 마우스 이벤트 제거, performance 향샹 기대 가능하다고 함
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

const classInfos = {
  [DIAGNOSIS_TYPE.LEAD_OFF]: 'Lead-off',
  [DIAGNOSIS_TYPE.NORMAL]: 'Normal',
  [DIAGNOSIS_TYPE.APC]: 'APC',
  [DIAGNOSIS_TYPE.VPC]: 'VPC',
  [DIAGNOSIS_TYPE.AFIB]: 'A-Fib',
  [DIAGNOSIS_TYPE.OTHERS]: 'Others',
  [DIAGNOSIS_TYPE.NOISE]: 'Noise',
  [DIAGNOSIS_TYPE.AVBLOCK]: 'AV Block',
  [DIAGNOSIS_TYPE.SVT]: 'SVT',
  [DIAGNOSIS_TYPE.VT]: 'VT',
  [DIAGNOSIS_TYPE.PAUSE]: 'Pause',
  [DIAGNOSIS_TYPE.NONE]: 'None',
};

const getChartHeightFromWidth = (width) => {
  return parseFloat((width * 0.02).toFixed(2));
};

function ECGTotalChart(props, ref) {
  const { time, data, diagnosis } = props;
  const [chartHeight, setChartHeight] = useState(
    getChartHeightFromWidth(window.innerWidth)
  );

  const handleResize = (event) => {
    const newWidth = event.target.innerWidth;
    setChartHeight(getChartHeightFromWidth(newWidth));
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Wrapper>
      <ClassContainer>
        <ClassSubContainer>
          <TimeText>{time}</TimeText>
          <LabelContainer>
            <ClassLabel
              classInfo={classInfos[diagnosis[0]]}
              onClick={() => {}}
            />
          </LabelContainer>
        </ClassSubContainer>
        <ClassSubContainer>
          <LabelContainer>
            <ClassLabel
              classInfo={classInfos[diagnosis[1]]}
              onClick={() => {}}
            />
          </LabelContainer>
        </ClassSubContainer>
        <ClassSubContainer>
          <LabelContainer>
            <ClassLabel
              classInfo={classInfos[diagnosis[2]]}
              onClick={() => {}}
            />
          </LabelContainer>
        </ClassSubContainer>
      </ClassContainer>
      <HighchartsReact
        highcharts={Highcharts}
        options={generateChartOptions(chartHeight, data)}
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[false, false, false]}
        containerProps={{ className: 'chartContainer' }}
      />
    </Wrapper>
  );
}

function dataAreEqual(prevProps, nextProps) {
  return (
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    JSON.stringify(prevProps.diagnosis) === JSON.stringify(nextProps.diagnosis)
  );
}

export default React.memo(React.forwardRef(ECGTotalChart), dataAreEqual);
