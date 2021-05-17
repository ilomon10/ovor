import { buttonOptions, buttonConfig } from './controlButton';
import { sliderOptions, sliderConfig } from './controlSlider';
import { barChartConfig } from './barChart';
import { pieChartOptions, pieChartConfig } from './pieChart';
import { timeseriesOptions, timeseriesConfig } from './timeseries';
import { numericOptions, numericConfig } from './numeric';
import { iframeConfig, iframeOptions } from './iframe';
import { tableConfig } from './table';
import { valuesConfig, valuesOptions } from './values';

export const GRAPH_TYPE = {
  "Button": 'control.button',
  "Slider": 'control.slider',
  "Bar Chart": 'plot.bar',
  "Pie Chart": 'radial',
  "Time Series Graph": 'plot.line',
  "Histogram": 'histogram',
  "Numeric": 'numeric',
  "Values": 'values',
  "Table": 'table',
  "Geo": 'geo',
  "IFrame": 'iframe',
}

export const GRAPH_OPTIONS = {
  [GRAPH_TYPE["Button"]]: buttonOptions,
  [GRAPH_TYPE["Slider"]]: sliderOptions,
  [GRAPH_TYPE["Pie Chart"]]: pieChartOptions,
  [GRAPH_TYPE["Time Series Graph"]]: timeseriesOptions,
  [GRAPH_TYPE["Numeric"]]: numericOptions,
  [GRAPH_TYPE["Values"]]: valuesOptions,
  [GRAPH_TYPE["IFrame"]]: iframeOptions,
}
export const GRAPH_CONFIG = {
  [GRAPH_TYPE["Button"]]: buttonConfig,
  [GRAPH_TYPE["Slider"]]: sliderConfig,
  [GRAPH_TYPE["Bar Chart"]]: barChartConfig,
  [GRAPH_TYPE["Pie Chart"]]: pieChartConfig,
  [GRAPH_TYPE["Time Series Graph"]]: timeseriesConfig,
  [GRAPH_TYPE["Numeric"]]: numericConfig,
  [GRAPH_TYPE["Values"]]: valuesConfig,
  [GRAPH_TYPE["Table"]]: tableConfig,
  [GRAPH_TYPE["IFrame"]]: iframeConfig
}