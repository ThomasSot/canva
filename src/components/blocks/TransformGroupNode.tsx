import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Group } from 'lucide-react';
import { DatablockData, GroupConfig } from '../../types';

const TransformGroupNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  const [config, setConfig] = useState<GroupConfig>({
    column: '',
    aggregation: {
      column: '',
      operation: 'count'
    }
  });
  const [availableColumns] = useState<string[]>(['name', 'age', 'city', 'salary']);

  const handleConfigChange = useCallback((field: keyof GroupConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAggregationChange = useCallback((field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      aggregation: prev.aggregation ? { ...prev.aggregation, [field]: value } : { column: '', operation: 'count' }
    }));
  }, []);

  const operationLabels = {
    count: 'Count',
    sum: 'Sum',
    avg: 'Average',
    min: 'Minimum',
    max: 'Maximum'
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
        <Group size={16} style={{ marginRight: '8px', color: '#667eea' }} />
        <strong>Group By</strong>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '0.8rem', color: '#6c757d', display: 'block', marginBottom: '4px' }}>
          Group by Column
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

      <div style={{ 
        border: '1px solid #e9ecef', 
        borderRadius: '4px', 
        padding: '8px',
        marginBottom: '8px',
        background: '#f8f9fa'
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: '500', marginBottom: '8px', color: '#495057' }}>
          Aggregation (Optional)
        </div>
        
        <div style={{ marginBottom: '6px' }}>
          <label style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block', marginBottom: '2px' }}>
            Operation
          </label>
          <select
            value={config.aggregation?.operation || 'count'}
            onChange={(e) => handleAggregationChange('operation', e.target.value)}
            style={{
              width: '100%',
              padding: '4px',
              border: '1px solid #dee2e6',
              borderRadius: '3px',
              fontSize: '0.75rem'
            }}
          >
            {Object.entries(operationLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {config.aggregation?.operation !== 'count' && (
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6c757d', display: 'block', marginBottom: '2px' }}>
              Column
            </label>
            <select
              value={config.aggregation?.column || ''}
              onChange={(e) => handleAggregationChange('column', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #dee2e6',
                borderRadius: '3px',
                fontSize: '0.75rem'
              }}
            >
              <option value="">Select column...</option>
              {availableColumns.filter(col => col !== config.column).map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {config.column && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: '#495057',
          background: '#e3f2fd',
          padding: '6px 8px',
          borderRadius: '4px'
        }}>
          Group by: {config.column}
          {config.aggregation?.operation !== 'count' && config.aggregation?.column && (
            <br />
          )}
          {config.aggregation?.operation !== 'count' && config.aggregation?.column && 
            `${operationLabels[config.aggregation.operation]} of ${config.aggregation.column}`
          }
          {config.aggregation?.operation === 'count' && <br />}
          {config.aggregation?.operation === 'count' && 'Count rows in each group'}
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

export default TransformGroupNode;
