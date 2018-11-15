import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import rootReducer from './reducers';
import App from './containers/App';
import Statistics from "./components/Statistics";
import CreateNew from "./components/CreateNew";

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
)

render(
  <Provider store={store}>
  <Router>
  <div>
          <Breadcrumb>
          <BreadcrumbItem><Link to="/">List </Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/CreateNew"> New</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/Statistics"> Stat</Link></BreadcrumbItem>
            </Breadcrumb>

          <Route path="/" exact component={App} />
          <Route path="/CreateNew" component={CreateNew} />
          <Route path="/Statistics" component={Statistics} />
        </div>
    </Router>
  </Provider>,
  document.getElementById('root')
)