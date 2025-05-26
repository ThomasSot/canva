import React, { useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import { DatablockData } from '../../types';
import { getExampleData } from '../../utils/dataProcessing';

const InputExampleNode: React.FC<NodeProps<DatablockData>> = ({ data, id }) => {
  useEffect(() => {
    // Automatically load example data when node is created
    const exampleData = getExampleData();
    // This would typically call a callback to update the node's output
    // For now, we'll just log it
    console.log('Example data loaded:', exampleData);
  }, []);

  return (
    <div style={{ 
      padding: '12px', 
      background: 'white', 
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      minWidth: '200px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '8px',
        color: '#495057'
      }}>
        <Play size={16} style={{ marginRight: '8px', color: '#667eea' }} />
        <strong>Example Data</strong>
      </div>
      
      <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '8px' }}>
        Sample dataset with employee information
      </div>
      
      <div style={{ 
        fontSize: '0.75rem', 
        color: '#28a745',
        background: '#d4edda',
        padding: '4px 8px',
        borderRadius: '4px'
      }}>
        ✓ 8 rows, 5 columns loaded
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#667eea' }}
      />
    </div>
  );
};

export default InputExampleNode;
