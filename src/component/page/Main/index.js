import './Main.css';
import { ReactComponent as Logo } from 'static/image/logo.svg';

function Main() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo width="30%" hanging="30%" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Main;
