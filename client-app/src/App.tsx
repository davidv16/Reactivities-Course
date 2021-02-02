import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createAsExpression } from 'typescript';
import { AsyncResource } from 'async_hooks';

function App() {
  return (
    <div className="App">
      <ul>
        {cars}
      </ul>
    </div>
  );
}

export default App;
