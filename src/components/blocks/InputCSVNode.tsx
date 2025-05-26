import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileText, Upload, Cloud } from 'lucide-react';
import { DatablockData } from '../../types';
import { parseCSV } from '../../utils/dataProcessing';
import { useDatablockContext } from '../DatablockEditor';
import { ApiService } from '../../utils/api';

const InputCSVNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  const { updateNodeOutput, addLog } = useDatablockContext();
  const [csvText, setCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataInfo, setDataInfo] = useState<{ rows: number; columns: number } | null>(null);

  // Backend upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [backendDataframeId, setBackendDataframeId] = useState<number | null>(null);
  const [saveToBackend, setSaveToBackend] = useState(true); // Toggle for backend saving

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Process locally first
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvText(text);
        processCSV(text);
      };
      reader.readAsText(file);

      // Upload to backend if enabled
      if (saveToBackend) {
        try {
          setIsUploading(true);
          setError(null);
          addLog(`Uploading ${file.name} to backend...`);

          // Upload file
          const uploadResponse = await ApiService.uploadCsvFile(file);
          addLog(`File uploaded successfully: ${uploadResponse.message}`);

          // Process file on backend
          const processResponse = await ApiService.processCsvFile(
            uploadResponse.file_name,
            uploadResponse.original_name,
            file.name.replace('.csv', '')
          );

          setBackendDataframeId(processResponse.dataframe_id);
          setUploadSuccess(true);
          addLog(`Dataframe created with ID: ${processResponse.dataframe_id} (${processResponse.rows_count} rows)`);

        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to upload to backend';
          setError(`Backend upload failed: ${errorMessage}`);
          addLog(`Backend upload error: ${errorMessage}`);
        } finally {
          setIsUploading(false);
        }
      }
    }
  }, [saveToBackend, addLog]);

  const processCSV = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await parseCSV(text);
      setDataInfo({ rows: result.data.length, columns: result.columns.length });

      // Update the node's output and notify the editor
      updateNodeOutput(id, result);
      addLog(`CSV loaded: ${result.data.length} rows, ${result.columns.length} columns`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse CSV';
      setError(errorMessage);
      addLog(`Error loading CSV: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [id, updateNodeOutput, addLog]);

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

      {/* Backend save toggle */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#6c757d',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={saveToBackend}
            onChange={(e) => setSaveToBackend(e.target.checked)}
            style={{ marginRight: '6px' }}
          />
          <Cloud size={12} style={{ marginRight: '4px' }} />
          Save to backend
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <textarea
          value={csvText}
          onChange={handleTextChange}
          placeholder={`Or paste CSV data here...

Example:
name,age,city
Alice,30,New York
Bob,25,San Francisco
Charlie,35,Chicago`}
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

      {isUploading && (
        <div style={{
          fontSize: '0.75rem',
          color: '#007bff',
          background: '#cce7ff',
          padding: '4px 8px',
          borderRadius: '4px',
          marginBottom: '8px'
        }}>
          <Cloud size={12} style={{ marginRight: '4px' }} />
          Uploading to backend...
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

      {uploadSuccess && backendDataframeId && (
        <div style={{
          fontSize: '0.75rem',
          color: '#007bff',
          background: '#cce7ff',
          padding: '4px 8px',
          borderRadius: '4px',
          marginBottom: '8px'
        }}>
          <Cloud size={12} style={{ marginRight: '4px' }} />
          ✓ Saved to backend (ID: {backendDataframeId})
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
