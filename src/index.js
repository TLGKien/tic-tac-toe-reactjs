import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Squares component, click -> tick 'x' or 'o'
// when winning -> highlight
function Square(props) {
  const winningSquareStyle = {
    backgroundColor: '#ccc'
  };
  return (
    <button 
      className="square" 
      onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningSquare = this.props.winningSquares && this.props.winningSquares.includes(i) ? true : false;
    return <Square 
      value={this.props.squares[i]} 
      onClick={()=>this.props.onClick(i)}
      winningSquare={winningSquare}
    />;
  }

  render() {
    let squares = [];
    for (let i = 0; i < 3; i++){
      let row = [];
      for (let j = 0; j < 3; j++){
        row.push(<span key={i*3+j}>{this.renderSquare(i*3+j)}</span>)
      }
      squares.push(<div className="board-row" key={i}>{row}</div>);
    }
    return (
      <div>{squares}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: Array(2).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = [Math.floor(i/3)+1, (i%3)+1];
    // nếu đã thắng hoặc đã ấn => bỏ qua
    if (calculateWinner(squares).winner || squares[i]){
      return;
    }

    if (this.state.xIsNext){
      squares[i] = "X";
    } else{
      squares[i] = "O";
    }
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortHandleClick(){
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  render() {
    const active = {
      fontWeight: 'bold'
    };

    const inactive = {
      fontWeight: 'normal'
    };

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const winner = calculateWinner(squares);
    const ascending = this.state.ascending;

    const moves = history.map((step, move) => {
      const desc = move ? 
        'go to move #' + move + " at: " + step.location :
        'Let go';
        return (
          <li key={move}>
            <button style={this.state.stepNumber === move ? active : inactive} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
    });

    let status;
    if (winner.player){
      status = "Winner: " + winner.player;
    } else{
      if (winner.isDraw) {
        status = "Result is draw";
      }else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            winningSquares = {winner.winningSquares}
          />
        </div>
        <div className="game-info">
        
          <div className="status">{status}</div>
          <ol>{ascending ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sortHandleClick()}>Toggle Sort Order</button>
        </div>
      </div>
    );
  }
}

// check người thắng mỗi khi người chơi đánh hoặc mỗi khi board render
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7], 
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
  // lấy từng case. [a,b,c]. nếu squres[a] = s[b] =s[c]; và a đã được đánh dấu => đã tạo đường đường 3 ô -> thằng đó sẽ thắng
  // else => chưa đủ 3 ô => null -> tiếp tục đánh
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winner = {
        player: squares[a],
        winningSquares: [a,b,c],
        isDraw: false,
      };
      return winner;
    }
  }
  
  let isDrawa = true;
  for (let i = 0; i < squares.length; i++){
    if (squares[i] === null){
      isDrawa = false;
    }
  }
  return {
    player: null,
    winningSquares: null,
    isDraw: isDrawa,
  };
}
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
