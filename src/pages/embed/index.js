import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "./dashboard";
import FourOFour from "pages/404";

const Embed = () => {
  return (
    <Switch>
      <Route path="/embed/dashboard/:id" component={Dashboard} />
      <Route path="/embed/" component={FourOFour} />
    </Switch>
  )
}

export default Embed;