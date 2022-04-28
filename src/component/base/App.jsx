import React, { useEffect, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
// Styled-components
import { ThemeProvider } from 'styled-components';
import StyledComponentsTheme from 'theme/StyledComponentsTheme';
import Main from 'component/page/Main';
import NotFoundPage from 'component/page/NotFoundPage';

function App(props) {
  return (
    <ThemeProvider theme={StyledComponentsTheme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/not-found" component={NotFoundPage} />
          <Redirect to="/not-found" />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
