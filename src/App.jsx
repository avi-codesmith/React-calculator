import { useReducer } from "react";
import DigitButton from "./components/DigitButtons";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "CHOOSE-OPERATION",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  const UpdatedCurrent = String(state.current);

  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          current: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.current === "0") {
        return state;
      }
      if (payload.digit === "." && UpdatedCurrent.includes(".")) {
        return state;
      }
      return {
        ...state,
        current: `${state.current || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {
        ...state,
        current: null,
        previous: null,
        operation: null,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.current == "0" || state.previous == "0") {
        return state;
      }
      if (state.previous === null) {
        return {
          ...state,
          operation: payload.operation,
          previous: state.current,
          current: null,
        };
      }

      if (!state.current) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        previous: evaluate(state.current, state.previous, state.operation),
        operation: payload.operation,
        current: null,
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation === null ||
        state.current === null ||
        state.previous === null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previous: null,
        operation: null,
        current: evaluate(state.current, state.previous, state.operation),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite === true) {
        return {
          ...state,
          overwrite: false,
          current: null,
        };
      }
      if (state.current == null) return state;
      if (state.current == 0) return state;
      if (state.current.length === 1) {
        return {
          ...state,
          current: null,
        };
      }
      return {
        ...state,
        current: state.current.slice(0, -1),
      };
  }
}

function evaluate(current, previous, operation) {
  const prev = Number(previous);
  const curr = Number(current);

  if (isNaN(prev) || isNaN(curr)) {
    return "";
  }

  let computation;

  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
    case "×":
      computation = prev * curr;
      break;
    default:
      return state;
  }

  return String(computation);
}

export default function App() {
  const [{ current, previous, operation }, dispatch] = useReducer(reducer, {
    current: 0,
    previous: null,
  });

  return (
    <div className="calculator">
      <div className="output">
        <div className="previous">
          {previous}
          {operation}
        </div>
        <div className="current">{current}</div>
      </div>
      <button
        className="gray span"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
        className="gray"
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
      >
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch}>
        7
      </DigitButton>
      <DigitButton digit="8" dispatch={dispatch}>
        8
      </DigitButton>
      <DigitButton digit="9" dispatch={dispatch}>
        9
      </DigitButton>
      <OperationButton operation="×" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch}>
        4
      </DigitButton>
      <DigitButton digit="5" dispatch={dispatch}>
        5
      </DigitButton>
      <DigitButton digit="6" dispatch={dispatch}>
        6
      </DigitButton>
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch}>
        1
      </DigitButton>
      <DigitButton digit="2" dispatch={dispatch}>
        2
      </DigitButton>
      <DigitButton digit="3" dispatch={dispatch}>
        3
      </DigitButton>
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch}>
        .
      </DigitButton>
      <DigitButton digit="0" dispatch={dispatch}>
        0
      </DigitButton>
      <button
        className="orange span"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}
