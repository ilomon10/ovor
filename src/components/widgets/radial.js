import React, { useState } from 'react';
import { ResizeSensor } from '@blueprintjs/core'
import { RadialChart } from 'react-vis';

// [angle, radius]

const Radial = ({ series, ...props }) => {
  const [sizing, setSizing] = useState({
    width: 0,
    height: 0
  });
  return (
    <>
      {series.map((v, i) => {
        const data = v.data.map((z) => ({ angle: z[0], radius: z[0] }))
        return (
          <ResizeSensor
            key={i}
            onResize={(e) => {
              let rect = e[0].contentRect;
              setSizing({ width: rect.width, height: rect.height });
            }}>
            <div style={{ width: '100%', height: '100%' }}>
              <RadialChart
                {...props}
                height={sizing.height}
                width={sizing.width}
                data={data} />
            </div>
          </ResizeSensor>
        )
      })}
    </>
  );
}

export default Radial;