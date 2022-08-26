import { React, useState } from 'react'
import './App.css';

export default function App() {
  const [counter, setCounter] = useState(0);

  const increase = () => {
    if (counter < 10) {
      setCounter(count => count + 1);
    }
  };

  const decrease = () => {
    if (counter > 0) {
      setCounter(count => count - 1);
    }
  };

  const reset = () => {
    setCounter(0)
  }

  return (
    <div className = "counter">
      <h1>Counter</h1>
      <span className = "counter__output">{counter}</span>
      <div className = "btn__container">
        <button className = "control__btn" onClick={increase}>+</button>
        <button className = "control__btn" onClick={decrease}>-</button>
      </div>
      <button className = "reset" onClick={reset}>Reset</button>
    </div>
  );
}