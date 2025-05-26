import React from 'react';
import { DataSet, DatablockNode } from '../types';

interface DataViewProps {
  data: DataSet | null;
  selectedNode: DatablockNode | null;
}

const DataView: React.FC<DataViewProps> = ({ data, selectedNode }) => {
  const exportData = (format: 'csv' | 'json') => {
    if (!data) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      const headers = data.columns.join(',');
      const rows = data.data.map(row => 
        data.columns.map(col => {
          const value = row[col];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      );
      content = [headers, ...rows].join('\n');
      filename = 'data.csv';
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify(data.data, null, 2);
      filename = 'data.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="data-view">
      <div className="panel-header">
        <span>Data Output</span>
        {selectedNode && (
          <span style={{ marginLeft: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
            {selectedNode.data.type} - {selectedNode.id}
          </span>
        )}
        {data && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => exportData('csv')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Export CSV
            </button>
            <button 
              onClick={() => exportData('json')}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Export JSON
            </button>
          </div>
        )}
      </div>
      <div className="panel-content">
        {!selectedNode ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#6c757d',
            fontSize: '0.9rem'
          }}>
            Select a node to view its output data
          </div>
        ) : !data ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#6c757d',
            fontSize: '0.9rem'
          }}>
            No data available for this node
          </div>
        ) : (
          <div>
            <div style={{ 
              marginBottom: '1rem', 
              fontSize: '0.875rem', 
              color: '#495057',
              display: 'flex',
              gap: '1rem'
            }}>
              <span><strong>Type:</strong> {data.type}</span>
              <span><strong>Rows:</strong> {data.data.length}</span>
              <span><strong>Columns:</strong> {data.columns.length}</span>
            </div>
            
            {data.type === 'tabular' && data.data.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '0.8rem'
                }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      {data.columns.map((column) => (
                        <th key={column} style={{ 
                          padding: '0.5rem', 
                          border: '1px solid #dee2e6',
                          textAlign: 'left',
                          fontWeight: '600'
                        }}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.slice(0, 100).map((row, index) => (
                      <tr key={index}>
                        {data.columns.map((column) => (
                          <td key={column} style={{ 
                            padding: '0.5rem', 
                            border: '1px solid #dee2e6'
                          }}>
                            {String(row[column] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.data.length > 100 && (
                  <div style={{ 
                    padding: '0.5rem', 
                    textAlign: 'center', 
                    color: '#6c757d',
                    fontSize: '0.8rem'
                  }}>
                    Showing first 100 rows of {data.data.length} total rows
                  </div>
                )}
              </div>
            ) : (
              <pre style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '4px',
                fontSize: '0.8rem',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(data.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataView;
