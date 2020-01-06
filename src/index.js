import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCube, faCubes, faCog, faChevronLeft, faChevronRight,
  faUserCircle, faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import 'react-mosaic-component/react-mosaic-component.css';
import 'react-vis/dist/style.css';
import './flexbox.css';

import ovorLogo from './components/icons/ovor';

library.add(
  ovorLogo, faCube, faCubes, faCog, faChevronRight, faChevronLeft,
  faUserCircle, faQuestionCircle
);

ReactDOM.render(
  (<BrowserRouter>
    <App />
  </BrowserRouter>), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
