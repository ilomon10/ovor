import React from 'react';

const Container = ({ style, children, ...props }) => {
  return (
    <div {...props} style={{ ...styles.container, ...style }}>
      {children}
    </div>
  )
}

const styles = {
  container: {
    padding: 12,
    maxWidth: 1024,
    margin: "0 auto"
  }
}

export default Container;