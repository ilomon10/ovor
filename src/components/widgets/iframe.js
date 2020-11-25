import React from 'react';
import RIFrame from 'react-iframe';
import _merge from 'lodash.merge';

export const defaultOptions = {
  url: "https://www.google.com"
}

export const iframeOptions = {
  url: { type: "string" }
}

export const iframeConfig = {
  seriesEnabled: false
}

const IFrame = ({ ...props }) => {
  const options = _merge({}, defaultOptions, props.options);
  return (
    <RIFrame
      url={options.url}
      width="100%"
      height="100%"
      sandbox={true}
    />
  )
}

export default IFrame;