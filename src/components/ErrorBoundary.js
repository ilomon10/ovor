import React from "react";
import { Text } from "@blueprintjs/core";
import { Box } from "./utility/grid";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    message: ""
  };
  componentDidCatch(err, info) {
    this.setState({
      hasError: true,
      message: info
    });
    if (err) console.error(err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box>
          <Text>Something went wrong <a href="mailto:ilomon10@gmail.com">send report</a>.</Text>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;