import React, { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import DatablockEditor from './components/DatablockEditor';
import './styles/App.css';

function App() {
  useEffect(() => {
    // Set JWT token in localStorage if not already present
    const existingToken = localStorage.getItem('jwt');
    if (!existingToken) {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1paWRvQGFkbWluLmNsIiwidXNlcl9pZCI6MSwiY29tcGFueV9pZCI6MTkwLCJpYXQiOjE3NDgwMjA3MTUsImV4cCI6MTc0ODAyNDMxNX0.fpKA240eBxUjb0cE9kU6e6fxHEJdS7EROV3OwIcmkbI';
      localStorage.setItem('jwt', token);
      console.log('JWT token set in localStorage');
    }
  }, []);

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
