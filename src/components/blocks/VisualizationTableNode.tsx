import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Table, Eye, EyeOff } from 'lucide-react';
import { DatablockData } from '../../types';

const VisualizationTableNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [maxRows, setMaxRows] = useState(5);

  // Mock data for preview - in real implementation this would come from input
  const mockData = [
    { name: 'Alice', age: 30, city: 'New York' },
    { name: 'Bob', age: 25, city: 'San Francisco' },
    { name: 'Charlie', age: 35, city: 'Chicago' }
  ];

  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };

  return (
    <div style={{ 
      padding: '12px', 
      background: 'white', 
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      minWidth: showPreview ? '400px' : '200px'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#667eea' }}
      />

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px',
        color: '#495057'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Table size={16} style={{ marginRight: '8px', color: '#667eea' }} />
          <strong>Data Table</strong>
        </div>
        <button
          onClick={togglePreview}
          style={{
            background: 'none',
            border: '1px solid #dee2e6',
            borderRadius: '3px',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: '4px' }}>
          Max Rows to Display
        </label>
        <input
          type="number"
          value={maxRows}
          onChange={(e) => setMaxRows(Number(e.target.value))}
          min="1"
          max="100"
          style={{
            width: '80px',
            padding: '4px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}
        />
      </div>

      {showPreview && (
        <div style={{ 
          marginBottom: '8px',
          border: '1px solid #e9ecef',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '6px 8px', 
            fontSize: '0.75rem', 
            fontWeight: '500',
            borderBottom: '1px solid #e9ecef'
          }}>
            Preview (showing {Math.min(mockData.length, maxRows)} of {mockData.length} rows)
          </div>
          <div style={{ overflow: 'auto', maxHeight: '150px' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.7rem'
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  {Object.keys(mockData[0] || {}).map((column) => (
                    <th key={column} style={{ 
                      padding: '4px 6px', 
                      border: '1px solid #dee2e6',
                      textAlign: 'left',
                      fontWeight: '500'
                    }}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockData.slice(0, maxRows).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} style={{ 
                        padding: '4px 6px', 
                        border: '1px solid #dee2e6'
                      }}>
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ 
        fontSize: '0.75rem', 
        color: '#6c757d',
        background: '#f8f9fa',
        padding: '6px 8px',
        borderRadius: '4px'
      }}>
        Table visualization ready
      </div>
    </div>
  );
};

export default VisualizationTableNode;
