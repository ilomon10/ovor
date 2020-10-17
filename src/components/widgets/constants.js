import { buttonOptions, buttonConfig } from './controlButton';
import { sliderOptions, sliderConfig } from './controlSlider';
import { timeseriesOptions, timeseriesConfig } from './timeseries';

export const GRAPH_TYPE = {
  "Button": 'control.button',
  "Slider": 'control.slider',
  "Bar Chart": 'plot.bar',
  "Pie Chart": 'radial',
  "Time Series Graph": 'plot.line',
  "Histogram": 'histogram',
  "Numeric": 'numeric',
  "Table": 'table',
  "Geo": 'geo',
}

export const GRAPH_OPTIONS = {
  [GRAPH_TYPE["Slider"]]: sliderOptions,
  [GRAPH_TYPE["Button"]]: buttonOptions,
  [GRAPH_TYPE["Time Series Graph"]]: timeseriesOptions,
}
export const GRAPH_CONFIG = {
  [GRAPH_TYPE["Slider"]]: sliderConfig,
  [GRAPH_TYPE["Button"]]: buttonConfig,
  [GRAPH_TYPE["Time Series Graph"]]: timeseriesConfig
}