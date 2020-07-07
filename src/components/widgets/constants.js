import { sliderOptions } from './controlSlider';

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
  [GRAPH_TYPE["Slider"]]: sliderOptions
}