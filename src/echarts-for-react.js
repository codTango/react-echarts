/* @flow */

/*
 * Copied from https://github.com/hustcc/echarts-for-react.
 * This react echarts wrapper has been modified from it's original format so that
 * we are not dependent upon the version of echarts included in the echarts-for-react repo.
 * The logic is the same, but the code has been refactored to es6.
 */

import echarts from 'echarts';
import React, { Component } from 'react';

import elementResizeEvent from 'element-resize-event';

export type ReactEchartsProps = {
  option: {},
  notMerge?: boolean,
  lazyUpdate?: boolean,
  style?: ?{},
  className?: string,
  theme?: string,
  onChartReady?: ?Function,
  showLoading?: boolean,
  onEvents?: ?{}
};

export default class ReactEcharts extends Component {
  props: ReactEchartsProps

  static defaultProps = {
    theme: 'shine'
  }

  // first add
  componentDidMount() {
    const echartObj = this.renderEchartDom();
    const onEvents = this.props.onEvents || {};

    this.bindEvents(echartObj, onEvents);
    // on chart ready
    if (typeof this.props.onChartReady === 'function') this.props.onChartReady(echartObj);

    // on resize
    // eslint-disable-next-line
    elementResizeEvent(this.refs.echartsDom, () => {
      echartObj.resize();
    });
  }

  // update
  componentDidUpdate() {
    this.renderEchartDom();
    this.bindEvents(this.getEchartsInstance(), this.props.onEvents || []);
  }

  // remove
  componentWillUnmount() {
    // eslint-disable-next-line
    echarts.dispose(this.refs.echartsDom);
  }

  // bind the events
  bindEvents(instance: any, events: any) {
    const _loop = function _loop(eventName) {
      // ignore the event config which not satisfy
      if (typeof eventName === 'string' && typeof events[eventName] === 'function') {
        // binding event
        instance.off(eventName);
        instance.on(eventName, (param) => {
          events[eventName](param, instance);
        });
      }
    };

    // eslint-disable-next-line
    for (const eventName in events) {
      _loop(eventName);
    }
  }

  // render the dom
  renderEchartDom() {
    // init the echart object
    const echartObj = this.getEchartsInstance();
    // set the echart option
    echartObj.setOption(this.props.option, this.props.notMerge || false, this.props.lazyUpdate || false);
    // set loading mask
    if (this.props.showLoading) echartObj.showLoading();
    else echartObj.hideLoading();

    return echartObj;
  }

  getEchartsInstance() {
    // return the echart object
    // eslint-disable-next-line
    return echarts.getInstanceByDom(this.refs.echartsDom) || echarts.init(this.refs.echartsDom, this.props.theme);
  }

  render() {
    const style = this.props.style || {
      height: '300px'
    };
    // for render
    return (
      <div
        // eslint-disable-next-line
        ref="echartsDom"
        className={this.props.className}
        style={style}
      />
    );
  }
}
