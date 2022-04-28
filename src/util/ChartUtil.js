const ChartUtil = {
  renderBorderGrid: (chart, xAxisTickLength, lineWidth, xIntervals, theme) => {
    const { x, y, width, height } = chart.plotBox;
    const yIntervals = 6;

    const renderer = chart.renderer;
    const yInterval = (height - lineWidth) / yIntervals;
    const xInterval = (width - lineWidth) / xIntervals;

    if (chart.huinnoBorder) {
      chart.huinnoBorder.destroy();
    }
    chart.huinnoBorder = renderer
      .path([
        'M',
        x - lineWidth,
        y - lineWidth / 2,
        'H',
        width + lineWidth * 2,
        'M',
        x - lineWidth,
        y + height + lineWidth / 2,
        'H',
        width + lineWidth * 2,
        'M',
        x - lineWidth / 2,
        y - lineWidth,
        'V',
        height + lineWidth * 2 + xAxisTickLength,
        'M',
        x + width + lineWidth / 2,
        y - lineWidth,
        'V',
        height + lineWidth * 2 + xAxisTickLength,
        'Z',
      ])
      .attr({
        className: 'huinno-chart-borde',
        stroke: theme.color.MEDIUM,
        'stroke-width': lineWidth,
        zIndex: 3,
      })
      .add();

    if (chart.huinnoGrid) {
      chart.huinnoGrid.destroy();
    }
    chart.huinnoGrid = renderer
      .g()
      .attr({
        className: 'huinno-chart-grid-g',
        zIndex: 2,
      })
      .add();

    const minorYPath = [];
    for (let i = 1; i < yIntervals; i++) {
      minorYPath.push('M', x, y + lineWidth / 2 + i * yInterval, 'H', width);
    }
    chart.huinnoGrid.renderer
      .path([...minorYPath, 'Z'])
      .attr({
        className: 'huinno-chart-grid-h-path',
        stroke: theme.color.MEDIUM_LIGHT,
        'stroke-width': lineWidth,
      })
      .add(chart.huinnoGrid);

    const minorXPath = [];
    const majorXPath = [];
    for (let i = 1; i < xIntervals; i++) {
      if (i % 5 !== 0) {
        minorXPath.push('M', x + lineWidth / 2 + i * xInterval, y, 'V', height);
      } else {
        majorXPath.push(
          'M',
          x + lineWidth / 2 + i * xInterval,
          y,
          'V',
          height + xAxisTickLength
        );
      }
    }
    chart.huinnoGrid.renderer
      .path([...minorXPath, 'Z'])
      .attr({
        className: 'huinno-chart-grid-v-minor-path',
        stroke: theme.color.MEDIUM_LIGHT,
        'stroke-width': lineWidth,
      })
      .add(chart.huinnoGrid);
    chart.huinnoGrid.renderer
      .path([...majorXPath, 'Z'])
      .attr({
        className: 'huinno-chart-grid-v-minor-path',
        stroke: theme.color.MEDIUM,
        'stroke-width': lineWidth,
      })
      .add(chart.huinnoGrid);
  },
};

export default ChartUtil;
