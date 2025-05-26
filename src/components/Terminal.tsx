import React, { useEffect, useRef } from 'react';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal">
      <div className="panel-header">
        Terminal
      </div>
      <div className="panel-content" ref={terminalRef}>
        {logs.length === 0 ? (
          <div style={{ opacity: 0.6 }}>
            Welcome to Canva Datablocks Terminal
            <br />
            Logs and messages will appear here...
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '0.25rem' }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Terminal;
