import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import DatablockEditor from './components/DatablockEditor';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Canva Datablocks</h1>
        <p>Node-based editor for exploring, analyzing and transforming data</p>
      </header>
      <ReactFlowProvider>
        <DatablockEditor />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
