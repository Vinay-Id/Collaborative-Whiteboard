import React from 'react';
import "./App.css"
import io from 'socket.io-client';
import Canvas from './components/Canvas';
const socket = io('http://localhost:5001');
function App() {
  return (
    <div className="WhiteboardApp">
      <div>
      <button>undo</button>
      <button>redo</button>
      </div>
      <Canvas socket={socket} />
    </div>
  );
}
export default App;
