import axios from "axios";
import React, { useState } from "react";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [deger, setDeger] = useState(initialIndex);
  const [sayac, setSayac] = useState(initialSteps);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState(initialMessage);

  const postObject = {
    email: email,
    x: (deger + 1) % 3 == 0 ? 3 : (deger + 1) % 3,
    y: deger < 3 ? 1 : deger < 6 ? 2 : deger < 9 ? 3 : false,
    steps: sayac,
  };

  function getXY() {
    const xyArray = [];
    for (let y = 1; y < 4; y++) {
      for (let x = 1; x < 4; x++) {
        xyArray.push(`(${x},${y})`);
      }
    }
    return xyArray[deger];
  }

  function getXYMesaj() {}

  function reset() {
    setSayac(0);
    setDeger(initialIndex);
    setMessage("");
    setEmail("");
  }

  function sonrakiIndex(yon) {
    if (
      yon === "left" &&
      (deger == 1 ||
        deger == 2 ||
        deger == 4 ||
        deger == 5 ||
        deger == 7 ||
        deger == 8)
    ) {
      setDeger(deger - 1);
      setSayac(sayac + 1);
      setMessage("");
    } else if (yon === "left") {
      setMessage("Sola gidemezsiniz");
    }

    if (
      yon === "right" &&
      (deger == 0 ||
        deger == 1 ||
        deger == 3 ||
        deger == 4 ||
        deger == 6 ||
        deger == 7)
    ) {
      setDeger(deger + 1);
      setSayac(sayac + 1);
      setMessage("");
    } else if (yon === "right") {
      setMessage("Sağa gidemezsiniz");
    }

    if (
      yon === "up" &&
      (deger == 3 ||
        deger == 4 ||
        deger == 5 ||
        deger == 6 ||
        deger == 7 ||
        deger == 8)
    ) {
      setDeger(deger - 3);
      setSayac(sayac + 1);
      setMessage("");
    } else if (yon === "up") {
      setMessage("Yukarıya gidemezsiniz");
    }

    if (yon === "down" && deger < 6) {
      setDeger(deger + 3);
      setSayac(sayac + 1);
      setMessage("");
    } else if (yon === "down") {
      setMessage("Aşağıya gidemezsiniz");
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    axios
      .post("http://localhost:9000/api/result", postObject)
      .then(function (response) {
        console.log(response);
        setMessage(response.data.message);
        setEmail("");
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        setMessage(error.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar {getXY()}</h3>
        <h3 id="steps">{sayac} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === deger ? " active" : ""}`}>
            {idx === deger ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={() => sonrakiIndex("left")} id="left">
          SOL
        </button>
        <button onClick={() => sonrakiIndex("up")} id="up" data-testid="yukarı">
          YUKARI
        </button>
        <button onClick={() => sonrakiIndex("right")} id="right">
          SAĞ
        </button>
        <button onClick={() => sonrakiIndex("down")} id="down">
          AŞAĞI
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form>
        <input
          onChange={onChange}
          value={email}
          id="email"
          type="email"
          placeholder="email girin"
        ></input>
        <input onClick={onSubmit} id="submit" type="submit"></input>
      </form>
    </div>
  );
}
