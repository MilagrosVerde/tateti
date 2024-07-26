import { useState } from "react";
import confetti from "canvas-confetti";

const TURNS = {
  X: "❌",
  O: "⚪",
};

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? "is-selected" : ""}`;
  const handleClick = () => {
    updateBoard(index);
  };
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};
const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X; // DOS SIFNOS DE PREGUNTA VEN SIU ES NULO O UNDEFINED
  });
  const [winner, setWinner] = useState(null);

  const checkWinner = (boardToCheck) => {
    // axa uso un for of para ver las combinaciones ganadores
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    // si nadie gano
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
  };
  // en esta funcion lo que ago es volver todos os estadios a su valor original para poder voilver a jugar el juegi

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null); // si todos los espacios en el tablero (squeare) son diferentes a null quiere decir que se termino el juegi
  };
  const updateBoard = (index) => {
    if (board[index] || winner) return; // aca lo q le digo es que si en el board en el indice q marco YA HAY ALGO, osea ya se jugo, QUE NO SE PUEDA ACTUALIZAR DENUEVO, para evitar oider jugar dos veces en un index

    const newBoard = [...board]; // LOS ESTADOS SIEMPRE HAY Q E TRATARLOS COMO INMUTABLES ACA CREO UN NUEVO ARRAY PARA NO MODIFICAR EL ORIGINAL, AL DESESTRUCTURARLO CREO OTRO
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    // aca guardo la partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", JSON.stringify(newTurn));

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); // HAY EMPATE
    }
  };
  return (
    <main className="board">
      <h1>Ta Te Ti</h1>
      <button onClick={resetGame}>Resetear el juego</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      {winner !== null && (
        <section className="winner">
          <div className="text">
            <h2>{winner === false ? "Empate" : " Gano: "}</h2>
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>
            <footer>
              <button onClick={resetGame}>Empezar denuevo</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
// para renderiuzar una lista necesito la key que es un identificador unico
// de ese ekenento

// EL USE STATE NUUUUUUUNCA PUEDE ESAR ADENTRO DE UN IF!!!!!!!!!!!
// SIEMPRE EN EL CUERPO DEL COMPONENTE

// EL ALERT BLOQUEA LA EJECUCIUN DEL CODIGO .mejor no usarlo

// el yuse state nos permite tener un estado que uando cambia se actualiza
// el use Efect es un hook que nos permite ejecutar un codigo arbitrario cuaqndo el componente se monta en el dom y cuando cambia las despedencias q ue nosotros le diganmos

// arbitrario es como decir q es el codigo que yo quier

// el useEfect RECIBE DOS PARAMETROS, EL CODIGO A EJECUTAR Y LA LISTA DE DEPENDEJCIAS
// useEffect(codeToexcecute , ListodDefependencias) // el codigo es una FUNCION
/*
Y EL SEGUNDO OSEA LA LISTA DE DEPENDENCIAS, ES UN ARRAY PERO ES OPCIONALLLLLLLLLL, 
<si no se lo paso el codigo se ejecuta cada vez que se renderice el componente
la lista de depenencias son las cosas que quiero cambiar, es decir , las cosas que cuanod cambien quiero que se ejecute 
el useefect
s
*/
