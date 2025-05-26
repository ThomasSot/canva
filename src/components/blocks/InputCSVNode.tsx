import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileText, Upload } from 'lucide-react';
import { DatablockData } from '../../types';
import { parseCSV } from '../../utils/dataProcessing';

const InputCSVNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  const [csvText, setCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataInfo, setDataInfo] = useState<{ rows: number; columns: number } | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvText(text);
        processCSV(text);
      };
      reader.readAsText(file);
    }
  }, []);

  const processCSV = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await parseCSV(text);
      setDataInfo({ rows: result.data.length, columns: result.columns.length });
      // Here you would typically call a callback to update the node's output
      console.log('CSV parsed:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setCsvText(text);
    processCSV(text);
  }, [processCSV]);

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
        <FileText size={16} style={{ marginRight: '8px', color: '#667eea' }} />
        <strong>CSV Input</strong>
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
          Upload CSV File
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <textarea
          value={csvText}
          onChange={handleTextChange}
          placeholder="Or paste CSV data here..."
          style={{
            width: '100%',
            height: '80px',
            padding: '8px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '0.8rem',
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
          ✓ {dataInfo.rows} rows, {dataInfo.columns} columns
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

export default InputCSVNode;
