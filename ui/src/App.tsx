import * as React from 'react';
import './App.css';
import Hello from './Hello';
import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Your Loyal Campsite Checker</h1>
          <p className="App-intro">
            Def not implemented in React.
          </p>
        </header>
        {Hello({name: 'shu'})}
      </div>
    );
  }
}

export default App;
