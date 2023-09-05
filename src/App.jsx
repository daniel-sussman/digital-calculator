import { useState } from "react";

function App() {

  const [input, setInput] = useState("0");
  const [output, setOutput] = useState("");

  function handleDigit(i) {
    if (/=-?[\d\.]+(e[\+-]\d+)*$|Error/.test(output)) {
      return i === "." ? replaceWithInput("0.") : replaceWithInput(i);
    } else if (i === "." && /\./.test(input)) {
      return
    }
    let proofInput = /\d[\+·\/-]$/.test(output) ? i : input + i;
    let proofOutput = output + i;

    //Correct proofInput and proofOutput
    if (/^\./.test(proofInput) || /^\./.test(proofOutput)) {
      proofInput = "0."
      proofOutput = proofOutput.slice(0, -1) + "0."
    } else if (/^0\d/.test(proofInput)) {
      proofInput = proofInput.slice(1);
      proofOutput = proofOutput.slice(0, -2) + i;
    }

    if (proofInput.length > 15 && input !== "DIGIT LIMIT MET") {
      setInput("DIGIT LIMIT MET");
      proofInput = proofInput.slice(0, -1)
      setTimeout(() => {
        setInput(proofInput)
      }, 1000);
    } else if (input !== "DIGIT LIMIT MET") {
      setInput(proofInput);
      setOutput(proofOutput);
    }
  }

  function handleOperator(j) {
    //replace the previous operator
    let proofOutput = output
      .replace(/[\+·\/.-]+$/, "")
      .replace(/(.+)=(.+)/, '$2');
    //begin a new output with the result of a previous operation / zero if error
    //or continue the current operation
    setOutput(output === "" || /Error/.test(output) ? "0" + j : proofOutput + j);
    setInput(j === "·" ? "×" : j);
  }

  function handleMinus() {
    let proofOutput = output.replace(/(.+)=(.+)/, '$2');
    //add minus sign, make negative if nec
    if (/\d[\+·\/-]?$/.test(proofOutput) || proofOutput === "") {
      setOutput(proofOutput + "-");
      setInput("-");
    //if error or operation complete, begin new output w/ result or zero
    } else if (/Error$/.test(output)) {
      setOutput("-");
      setInput("-");
    }
  }


  function compute() {
    let proofOutput = output.replace(/(.*)([\+·\/-]+$)/, '$1');
    let result = eval(proofOutput
      .replace(/(.*)(=)/, "")
      .replace(/(--)([\d\.]+)/g, '-(-$2)')
      .replace(/·/g, "*")
      );
    if (isNaN(result) || !isFinite(result)) {
      result = "Error"
      setTimeout(() => {
        setInput("0")
      }, 1000);
    }
    setInput(result);
    setOutput(proofOutput + "=" + result);
  }

  function replaceWithInput(n) {
    setInput(n);
    setOutput(n);
  }

  return (
    <div id="page">
      <div className="frame">
        <p className="display output">{output}</p>
        <p className="display input">{input}</p>
        <div className="button-row">
          <button className="button wide clear" onClick={() => {setInput("0"); setOutput("")}}>AC</button>
          <button className="button" onClick={() => {handleOperator("/")}}>/</button>
          <button className="button" onClick={() => {handleOperator("·")}}>×</button>
        </div>
        <div className="button-row">
          <button className="button numeral" onClick={() => {handleDigit("7")}}>7</button>
          <button className="button numeral" onClick={() => {handleDigit("8")}}>8</button>
          <button className="button numeral" onClick={() => {handleDigit("9")}}>9</button>
          <button className="button" onClick={handleMinus}>-</button>
        </div>
        <div className="button-row">
          <button className="button numeral" onClick={() => {handleDigit("4")}}>4</button>
          <button className="button numeral" onClick={() => {handleDigit("5")}}>5</button>
          <button className="button numeral" onClick={() => {handleDigit("6")}}>6</button>
          <button className="button" onClick={() => {handleOperator("+")}}>+</button>
        </div>
        <div className="button-row">
          <button className="button numeral" onClick={() => {handleDigit("1")}}>1</button>
          <button className="button numeral" onClick={() => {handleDigit("2")}}>2</button>
          <button className="button numeral" onClick={() => {handleDigit("3")}}>3</button>
          <button className="button equals" onClick={compute}>=</button>
        </div>
        <div className="button-row">
          <button className="button wide numeral" onClick={() => {handleDigit("0")}}>0</button>
          <button className="button numeral" onClick={() => {handleDigit(".")}}>.</button>
        </div>
      </div>
      <div className="byline">
        <p>Coded by</p>
        <p className="my-name">Daniel Sussman</p>
      </div>
    </div>
  )
}

export default App
