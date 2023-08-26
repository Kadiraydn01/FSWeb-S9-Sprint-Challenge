import React, { useState } from "react";

export default function AppFunctional(props) {
  const initialMessage = "";
  const initialEmail = "";
  const initialSteps = 0;
  const initialIndex = 4;

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    const gridSize = 3;
    const xCoordinate = (index % gridSize) + 1;
    const yCoordinate = Math.floor(index / gridSize) + 1;
    return { x: xCoordinate, y: yCoordinate };
  }

  function getXYMesaj() {
    const coordinates = getXY();
    return `Koordinatlar (${coordinates.x}, ${coordinates.y})`;
  }

  function reset() {
    setSteps(initialSteps);
    setIndex(initialIndex);
    setMessage(initialMessage);
    setEmail(initialEmail);
  }

  function sonrakiIndex(yon) {
    const gridSize = 3;
    const currentIndex = index;
    let nextIndex = currentIndex;

    if (yon === "left" && currentIndex % gridSize !== 0) {
      nextIndex = currentIndex - 1;
    } else if (yon === "up" && currentIndex >= gridSize) {
      nextIndex = currentIndex - gridSize;
    } else if (yon === "right" && currentIndex % gridSize !== gridSize - 1) {
      nextIndex = currentIndex + 1;
    } else if (yon === "down" && currentIndex < gridSize * gridSize - 3) {
      nextIndex = currentIndex + gridSize;
    }

    return nextIndex;
  }

  function ilerle(evt) {
    const direction = evt.target.id;
    const nextIndex = sonrakiIndex(direction);
    setIndex(nextIndex);
    setSteps(steps + 1);
  }

  function onChange(evt) {
    const newEmail = evt.target.value;
    setEmail(newEmail);
  }

  function onSubmit(evt) {
    evt.preventDefault();

    const coordinates = getXY();
    const payload = {
      x: coordinates.x,
      y: coordinates.y,
      steps: steps,
      email: email,
    };

    fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("API isteği başarısız");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Hata:", error);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>
          SOL
        </button>
        <button id="up" onClick={ilerle}>
          YUKARI
        </button>
        <button id="right" onClick={ilerle}>
          SAĞ
        </button>
        <button id="down" onClick={ilerle}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
