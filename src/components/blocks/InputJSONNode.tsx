import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Database, Upload } from 'lucide-react';
import { DatablockData } from '../../types';
import { parseJSON } from '../../utils/dataProcessing';
import { useDatablockContext } from '../DatablockEditor';

const InputJSONNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  const { updateNodeOutput, addLog } = useDatablockContext();
  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataInfo, setDataInfo] = useState<{ rows: number; columns: number; type: string } | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setJsonText(text);
        processJSON(text);
      };
      reader.readAsText(file);
    }
  }, []);

  const processJSON = useCallback((text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = parseJSON(text);
      setDataInfo({
        rows: Array.isArray(result.data) ? result.data.length : 1,
        columns: result.columns.length,
        type: result.type
      });

      // Update the node's output and notify the editor
      updateNodeOutput(id, result);
      addLog(`JSON loaded: ${Array.isArray(result.data) ? result.data.length : 1} ${result.type === 'tabular' ? 'rows' : 'object'}, ${result.columns.length} ${result.type === 'tabular' ? 'columns' : 'properties'}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse JSON';
      setError(errorMessage);
      addLog(`Error loading JSON: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [id, updateNodeOutput, addLog]);

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setJsonText(text);
    processJSON(text);
  }, [processJSON]);

  return (
    <div style={{
      padding: '12px',
      background: 'white',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      minWidth: '250px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        color: '#495057'
      }}>
        <Database size={16} style={{ marginRight: '8px', color: '#667eea' }} />
        <strong>JSON Input</strong>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.8rem'
        }}>
          <Upload size={14} style={{ marginRight: '6px' }} />
          Upload JSON File
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <textarea
          value={jsonText}
          onChange={handleTextChange}
          placeholder="Or paste JSON data here..."
          style={{
            width: '100%',
            height: '100px',
            padding: '8px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            resize: 'vertical'
          }}
        />
      </div>

      {isLoading && (
        <div style={{
          fontSize: '0.75rem',
          color: '#6c757d',
          padding: '4px 8px'
        }}>
          Processing...
        </div>
      )}

      {error && (
        <div style={{
          fontSize: '0.75rem',
          color: '#dc3545',
          background: '#f8d7da',
          padding: '4px 8px',
          borderRadius: '4px',
          marginBottom: '8px'
        }}>
          Error: {error}
        </div>
      )}

      {dataInfo && (
        <div style={{
          fontSize: '0.75rem',
          color: '#28a745',
          background: '#d4edda',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          ✓ {dataInfo.type === 'tabular' ? `${dataInfo.rows} rows, ` : ''}
          {dataInfo.columns} {dataInfo.type === 'tabular' ? 'columns' : 'properties'}
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

export default InputJSONNode;
