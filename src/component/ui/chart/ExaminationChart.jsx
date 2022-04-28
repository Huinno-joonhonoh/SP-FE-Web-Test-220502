import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';
import styled from 'styled-components';
const SimpleGridChart = loadable(() =>
  import('component/ui/chart/SimpleGridChart')
);

const InfoItemWrapper = styled.div`
  :not(:last-child) {
    margin-bottom: 6px;
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const InfoItemLabelText = styled.div`
  font-size: 11px;
`;

const InfoItemValueText = styled.div`
  font-size: 11px;
  font-weight: bold;
`;

function InfoItem(props) {
  return (
    <InfoItemWrapper>
      <InfoItemLabelText>{props.label}</InfoItemLabelText>
      <InfoItemValueText>{props.value}</InfoItemValueText>
    </InfoItemWrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const TitleText = styled.div`
  font-size: 14px;
  line-height: 130%;
  font-weight: 700;
`;

const SubTitleText = styled.div`
  margin: 6px 0;
  font-size: 10px;
  line-height: 130%;
`;

const ChartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

const InfoContainer = styled.div`
  min-width: 120px;
  height: 100%;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

function ExaminationChart(props) {
  const { title, subtitle, rawData, onClickChart, info, chartWidth } = props;

  return (
    <Wrapper>
      <TitleText>{title}</TitleText>
      <SubTitleText>{subtitle}</SubTitleText>

      <ChartContainer>
        <SimpleGridChart
          data={rawData}
          onClickChart={onClickChart}
          width={chartWidth}
        />

        {info && (
          <InfoContainer>
            {Object.keys(info).map((infoItemKey) => {
              const infoItemValue = info[infoItemKey];
              return (
                <InfoItem
                  key={infoItemKey}
                  label={infoItemKey}
                  value={infoItemValue}
                />
              );
            })}
          </InfoContainer>
        )}
      </ChartContainer>
    </Wrapper>
  );
}

export default ExaminationChart;
