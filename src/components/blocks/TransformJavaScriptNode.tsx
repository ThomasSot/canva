import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Code, Play } from 'lucide-react';
import { DatablockData } from '../../types';

const TransformJavaScriptNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  const [code, setCode] = useState(`// Transform function
// Input data is available as 'data' parameter
// Lodash is available as '_'

function transform(data) {
  // Example: Filter data where age > 30
  return data.filter(row => row.age > 30);
  
  // Example: Add calculated field
  // return data.map(row => ({
  //   ...row,
  //   ageGroup: row.age < 30 ? 'Young' : 'Senior'
  // }));
}`);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
    setError(null);
  }, []);

  const validateCode = useCallback(() => {
    try {
      // Basic syntax validation
      new Function('_', 'data', code);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Syntax error');
    }
  }, [code]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div style={{ 
      padding: '12px', 
      background: 'white', 
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      minWidth: '300px',
      maxWidth: isExpanded ? '500px' : '300px'
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
          <Code size={16} style={{ marginRight: '8px', color: '#667eea' }} />
          <strong>JavaScript</strong>
        </div>
        <button
          onClick={toggleExpanded}
          style={{
            background: 'none',
            border: '1px solid #dee2e6',
            borderRadius: '3px',
            padding: '2px 6px',
            fontSize: '0.7rem',
            cursor: 'pointer'
          }}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <textarea
          value={code}
          onChange={handleCodeChange}
          onBlur={validateCode}
          style={{
            width: '100%',
            height: isExpanded ? '200px' : '120px',
            padding: '8px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            resize: 'vertical',
            lineHeight: '1.4'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button
          onClick={validateCode}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <Play size={12} style={{ marginRight: '4px' }} />
          Validate
        </button>
      </div>

      {error && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: '#dc3545',
          background: '#f8d7da',
          padding: '6px 8px',
          borderRadius: '4px',
          marginBottom: '8px'
        }}>
          Error: {error}
        </div>
      )}

      {!error && code.trim() && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: '#28a745',
          background: '#d4edda',
          padding: '6px 8px',
          borderRadius: '4px'
        }}>
          ✓ Code syntax is valid
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

export default TransformJavaScriptNode;
