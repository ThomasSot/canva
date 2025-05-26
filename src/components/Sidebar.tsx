import React from 'react';
import { 
  FileText, 
  Database, 
  Play, 
  Filter, 
  Group, 
  ArrowUpDown, 
  Code, 
  Table, 
  BarChart3,
  Download 
} from 'lucide-react';
import { BlockDefinition } from '../types';

const blockDefinitions: BlockDefinition[] = [
  // Input blocks
  {
    type: 'input-csv',
    label: 'CSV Input',
    category: 'input',
    icon: 'FileText',
    description: 'Load data from CSV file or text'
  },
  {
    type: 'input-json',
    label: 'JSON Input',
    category: 'input',
    icon: 'Database',
    description: 'Load data from JSON file or text'
  },
  {
    type: 'input-example',
    label: 'Example Data',
    category: 'input',
    icon: 'Play',
    description: 'Use sample dataset for testing'
  },
  
  // Transform blocks
  {
    type: 'transform-filter',
    label: 'Filter',
    category: 'transform',
    icon: 'Filter',
    description: 'Filter rows based on conditions'
  },
  {
    type: 'transform-group',
    label: 'Group By',
    category: 'transform',
    icon: 'Group',
    description: 'Group data and apply aggregations'
  },
  {
    type: 'transform-sort',
    label: 'Sort',
    category: 'transform',
    icon: 'ArrowUpDown',
    description: 'Sort data by column values'
  },
  {
    type: 'transform-javascript',
    label: 'JavaScript',
    category: 'transform',
    icon: 'Code',
    description: 'Custom data transformation with code'
  },
  
  // Visualization blocks
  {
    type: 'visualization-table',
    label: 'Data Table',
    category: 'visualization',
    icon: 'Table',
    description: 'Display data in table format'
  },
  {
    type: 'visualization-chart',
    label: 'Chart',
    category: 'visualization',
    icon: 'BarChart3',
    description: 'Create charts and graphs'
  },
  
  // Output blocks
  {
    type: 'output-export',
    label: 'Export',
    category: 'output',
    icon: 'Download',
    description: 'Export data to file'
  }
];

const iconMap = {
  FileText,
  Database,
  Play,
  Filter,
  Group,
  ArrowUpDown,
  Code,
  Table,
  BarChart3,
  Download
};

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const groupedBlocks = blockDefinitions.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, BlockDefinition[]>);

  const categoryTitles = {
    input: 'Input',
    transform: 'Transform',
    visualization: 'Visualization',
    output: 'Output'
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Data Blocks</h3>
        <p>Drag blocks to the canvas to build your data flow</p>
      </div>
      <div className="sidebar-content">
        {Object.entries(groupedBlocks).map(([category, blocks]) => (
          <div key={category} className="block-category">
            <div className="category-title">
              {categoryTitles[category as keyof typeof categoryTitles]}
            </div>
            {blocks.map((block) => {
              const IconComponent = iconMap[block.icon as keyof typeof iconMap];
              return (
                <div
                  key={block.type}
                  className="block-item"
                  draggable
                  onDragStart={(event) => onDragStart(event, block.type)}
                >
                  <div className="block-icon">
                    <IconComponent size={20} />
                  </div>
                  <div className="block-info">
                    <h4>{block.label}</h4>
                    <p>{block.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
