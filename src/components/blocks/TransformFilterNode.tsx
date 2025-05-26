import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Filter } from 'lucide-react';
import { DatablockData, FilterConfig } from '../../types';

const TransformFilterNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  const [config, setConfig] = useState<FilterConfig>({
    column: '',
    operator: 'equals',
    value: ''
  });
  const [availableColumns] = useState<string[]>(['name', 'age', 'city', 'salary']); // This would come from input data

  const handleConfigChange = useCallback((field: keyof FilterConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  }, []);

  const operatorLabels = {
    equals: 'Equals',
    not_equals: 'Not Equals',
    greater_than: 'Greater Than',
    less_than: 'Less Than',
    contains: 'Contains',
    not_contains: 'Does Not Contain'
  };

  return (
    <div style={{ 
      padding: '12px', 
      background: 'white', 
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      minWidth: '250px'
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
        <Filter size={16} style={{ marginRight: '8px', color: '#667eea' }} />
        <strong>Filter</strong>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: '4px' }}>
          Column
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

      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: '4px' }}>
          Operator
        </label>
        <select
          value={config.operator}
          onChange={(e) => handleConfigChange('operator', e.target.value)}
          style={{
            width: '100%',
            padding: '6px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}
        >
          {Object.entries(operatorLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: '4px' }}>
          Value
        </label>
        <input
          type="text"
          value={config.value}
          onChange={(e) => handleConfigChange('value', e.target.value)}
          placeholder="Enter filter value..."
          style={{
            width: '100%',
            padding: '6px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}
        />
      </div>

      {config.column && config.value && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: '#495057',
          background: '#f8f9fa',
          padding: '6px 8px',
          borderRadius: '4px',
          marginBottom: '8px'
        }}>
          Filter: {config.column} {operatorLabels[config.operator].toLowerCase()} "{config.value}"
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

export default TransformFilterNode;
