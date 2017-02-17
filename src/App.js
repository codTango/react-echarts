import React, { Component } from 'react';
import ReactEcharts from './echarts-for-react';
// import data from './data/37000-data';
// import data from './data/13ind-5min-year';
// import data from './data/data';
import data from './data/laggyPM1-426';

class App extends Component {
  getOption1 = () => {
    const { pm } = data.data;
    const seriesData = [];
    const timeSpan = [];
    const legend = [];
    pm.indicators.map((indicator,index) => {
      legend.push('pm line ' + index);
      seriesData.push({
        data: indicator.indicatorData.data.map(d => d.value),
        name: 'pm line ' + index,
        type: 'line',
        sampling: 'average',
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 0.1
      });
    });
    pm.indicators[0].indicatorData.data.forEach(d => {
      const time = new Date(d.time);
      timeSpan.push(`${time.getDate()}/${time.getMonth()+1} ${time.getFullYear()}`);
    });

    const dataLength = seriesData.map(d => d.data.length);
    const datapointCount = dataLength.reduce((a, b) => a + b);

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
          data:legend
      },
      xAxis: {
          data: timeSpan
      },
      yAxis: {
        axisLabel: {
          formatter: (value) => {
            return `${value} %`;
          }
        }
      },
      animation: false,
      series: seriesData,
      toolbox: {
        orient: 'vertical',
        itemGap: 20,
        top: 100,
        right: 40,
        feature: {
          dataZoom: {
            yAxisIndex: false,
            title: { zoom: 'Zoom In', back: 'Zoom Out' }
          },
          magicType: {
            type: [ 'line', 'bar' ],
            title: { line: 'Line', bar: 'Bar' }
          },
          restore: { title: 'Restore' },
          saveAsImage: { title: 'Save As Image' }
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100
        }
      ]
    };

    return { option, datapointCount, seriesData };
  };

  render() {
    let t0 = performance.now();
    const { option, datapointCount, seriesData } = this.getOption1();
    console.log(option);
    return (
      <div>
        <h2>{`Operating on ${datapointCount} datapoints over ${seriesData.length} series.`}</h2>
        <ReactEcharts
          notMerge={true}
          lazyUpdate={true}
          option={option}
          style={{height: '700px', width: '100%'}}
        />
      </div>
    );
  };


  // getOption2 = () => {
  //   const { pm } = data.data;
  //   const seriesData = [];
  //   const timeSpan = [];
  //   const legend = [];
  //   pm.timeSeriesData.map((indicator,index) => {
  //     legend.push('pm line ' + index);
  //     seriesData.push({
  //       data: indicator.data.map(d => d.value),
  //       name: 'pm line ' + index,
  //       type: 'line',
  //       sampling: 'average'
  //     });
  //   });
  //   pm.timeSeriesData[0].data.forEach(d => {
  //     const time = new Date(d.timestamp * 1000);
  //     timeSpan.push(`${time.getDate()}/${time.getMonth()+1} ${time.getFullYear()}`);
  //   });
  //
  //   const dataLength = seriesData.map(d => d.data.length);
  //   const datapointCount = dataLength.reduce((a, b) => a + b);
  //   const option = {
  //     tooltip: {
  //       trigger: 'axis'
  //     },
  //     legend: {
  //         data:legend
  //     },
  //     xAxis: {
  //         data: timeSpan
  //     },
  //     yAxis: {},
  //     animation: false,
  //     series: seriesData
  //   };
  //
  //   return { option };
  // };
}

export default App;
