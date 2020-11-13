import React from "react";
import { Text } from "@blueprintjs/core";
import { Box } from "./utility/grid";

class ErrorBoundary extends React.Component {
  constructor() {
    super();
    this.state = {
      hasError: false,
      message: ""
    };
  }
  componentDidCatch(err, info) {
    this.setState({
      hasError: true,
      message: info
    });
    console.log(err);
    console.log(info);
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