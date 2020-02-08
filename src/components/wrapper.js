import React from 'react';

const Wrapper = ({ style, children, ...props }) => {
  return (
    <div {...props} style={{ ...styles.container, ...style }}>
      {children}
    </div>
  )
}

const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
}

export default Wrapper;