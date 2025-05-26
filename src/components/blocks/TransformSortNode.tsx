import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ArrowUpDown } from 'lucide-react';
import { DatablockData, SortConfig } from '../../types';

const TransformSortNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  const [config, setConfig] = useState<SortConfig>({
    column: '',
    direction: 'asc'
  });
  const [availableColumns] = useState<string[]>(['name', 'age', 'city', 'salary']);

  const handleConfigChange = useCallback((field: keyof SortConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div style={{ 
      padding: '12px', 
      background: 'white', 
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      minWidth: '220px'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#667eea' }}
      />

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '12px',
        color: '#495057'
      }}>
        <ArrowUpDown size={16} style={{ marginRight: '8px', color: '#667eea' }} />
        <strong>Sort</strong>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: '4px' }}>
          Sort by Column
        </label>
        <select
          value={config.column}
          onChange={(e) => handleConfigChange('column', e.target.value)}
          style={{
            width: '100%',
            padding: '6px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}
        >
          <option value="">Select column...</option>
          {availableColumns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: '4px' }}>
          Direction
        </label>
        <select
          value={config.direction}
          onChange={(e) => handleConfigChange('direction', e.target.value)}
          style={{
            width: '100%',
            padding: '6px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}
        >
          <option value="asc">Ascending (A-Z, 1-9)</option>
          <option value="desc">Descending (Z-A, 9-1)</option>
        </select>
      </div>

      {config.column && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: '#495057',
          background: '#f8f9fa',
          padding: '6px 8px',
          borderRadius: '4px'
        }}>
          Sort by: {config.column} ({config.direction === 'asc' ? 'ascending' : 'descending'})
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#667eea' }}
      />
    </div>
  );
};

export default TransformSortNode;
