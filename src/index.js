import React from 'react';
import ReactDOM from 'react-dom';
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
import '@blueprintjs/table/lib/css/table.css';
import 'react-mosaic-component/react-mosaic-component.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './flexbox.css';

import ovorLogo from './components/icons/ovor';
import Router from './Router';

library.add(
  ovorLogo, faCube, faCubes, faCog, faChevronRight, faChevronLeft,
  faUserCircle, faQuestionCircle
);

ReactDOM.render(<Router />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
