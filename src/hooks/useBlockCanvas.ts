import { useState, useEffect, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import ApiService from '../utils/api';
import { 
  BlockCanvas, 
  CompleteCanvas, 
  DatablockNode, 
  DatablockEdge,
  CreateNodeRequest,
  CreateEdgeRequest,
  UpdateNodeRequest
} from '../types';

interface UseBlockCanvasProps {
  processId: number;
  canvasName?: string;
}

interface UseBlockCanvasReturn {
  canvas: BlockCanvas | null;
  nodes: DatablockNode[];
  edges: DatablockEdge[];
  loading: boolean;
  error: string | null;
  
  // Canvas operations
  createCanvas: (name: string, description?: string) => Promise<void>;
  loadCanvas: () => Promise<void>;
  saveCanvas: () => Promise<void>;
  
  // Node operations
  addNode: (node: DatablockNode) => Promise<void>;
  updateNode: (nodeId: string, updates: Partial<DatablockNode>) => Promise<void>;
  removeNode: (nodeId: string) => Promise<void>;
  
  // Edge operations
  addEdge: (edge: DatablockEdge) => Promise<void>;
  removeEdge: (edgeId: string) => Promise<void>;
  
  // Local state management
  setNodes: React.Dispatch<React.SetStateAction<DatablockNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<DatablockEdge[]>>;
}

export const useBlockCanvas = ({ processId, canvasName = 'Default Canvas' }: UseBlockCanvasProps): UseBlockCanvasReturn => {
  const [canvas, setCanvas] = useState<BlockCanvas | null>(null);
  const [nodes, setNodes] = useState<DatablockNode[]>([]);
  const [edges, setEdges] = useState<DatablockEdge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert backend node to frontend node
  const convertBackendNodeToFrontend = useCallback((backendNode: any): DatablockNode => {
    return {
      id: backendNode.node_id,
      type: backendNode.type,
      position: {
        x: backendNode.position_x,
        y: backendNode.position_y
      },
      data: {
        id: backendNode.node_id,
        type: backendNode.type,
        data: backendNode.config_data || {},
        output: backendNode.output_data
      },
      style: {
        width: backendNode.width || 250,
        height: backendNode.height || 150
      },
      selected: backendNode.is_selected || false,
      dragging: backendNode.is_dragging || false,
      zIndex: backendNode.z_index || 1
    };
  }, []);

  // Convert backend edge to frontend edge
  const convertBackendEdgeToFrontend = useCallback((backendEdge: any): DatablockEdge => {
    return {
      id: backendEdge.edge_id,
      source: backendEdge.source_node_id,
      target: backendEdge.target_node_id,
      sourceHandle: backendEdge.source_handle,
      targetHandle: backendEdge.target_handle,
      type: backendEdge.edge_type || 'default',
      animated: backendEdge.is_animated || false,
      style: backendEdge.style_data || {},
      markerEnd: backendEdge.marker_end ? { type: backendEdge.marker_end } : undefined
    };
  }, []);

  // Convert frontend node to backend format
  const convertFrontendNodeToBackend = useCallback((frontendNode: DatablockNode, canvasId: number): CreateNodeRequest => {
    return {
      canvas_id: canvasId,
      node_id: frontendNode.id,
      type: frontendNode.type || frontendNode.data.type,
      label: frontendNode.data.label,
      position_x: frontendNode.position.x,
      position_y: frontendNode.position.y,
      width: frontendNode.style?.width as number || 250,
      height: frontendNode.style?.height as number || 150,
      config_data: frontendNode.data.data,
      output_data: frontendNode.data.output,
      z_index: frontendNode.zIndex || 1
    };
  }, []);

  // Convert frontend edge to backend format
  const convertFrontendEdgeToBackend = useCallback((frontendEdge: DatablockEdge, canvasId: number): CreateEdgeRequest => {
    return {
      canvas_id: canvasId,
      edge_id: frontendEdge.id,
      source_node_id: frontendEdge.source,
      target_node_id: frontendEdge.target,
      source_handle: frontendEdge.sourceHandle,
      target_handle: frontendEdge.targetHandle,
      edge_type: frontendEdge.type || 'default',
      is_animated: frontendEdge.animated || false,
      style_data: frontendEdge.style,
      marker_end: frontendEdge.markerEnd?.type
    };
  }, []);

  // Create a new canvas
  const createCanvas = useCallback(async (name: string, description?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.createCanvas({
        process_id: processId,
        name,
        description
      });
      
      console.log('Canvas created:', response);
      await loadCanvas(); // Reload to get the new canvas
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create canvas';
      setError(errorMessage);
      console.error('Error creating canvas:', err);
    } finally {
      setLoading(false);
    }
  }, [processId]);

  // Load canvas from backend
  const loadCanvas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, get canvas by process ID
      const canvasList = await ApiService.getCanvasByProcessId(processId);
      
      if (canvasList.length === 0) {
        // No canvas exists, create one
        await createCanvas(canvasName);
        return;
      }
      
      const currentCanvas = canvasList[0]; // Use the first canvas
      setCanvas(currentCanvas);
      
      // Get complete canvas data
      const completeCanvas = await ApiService.getCompleteCanvas(currentCanvas.id);
      
      // Convert backend data to frontend format
      const frontendNodes = completeCanvas.nodes.map(convertBackendNodeToFrontend);
      const frontendEdges = completeCanvas.edges.map(convertBackendEdgeToFrontend);
      
      setNodes(frontendNodes);
      setEdges(frontendEdges);
      
      console.log('Canvas loaded:', completeCanvas);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load canvas';
      setError(errorMessage);
      console.error('Error loading canvas:', err);
    } finally {
      setLoading(false);
    }
  }, [processId, canvasName, createCanvas, convertBackendNodeToFrontend, convertBackendEdgeToFrontend]);

  // Save current canvas state
  const saveCanvas = useCallback(async () => {
    if (!canvas) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Convert nodes and edges to backend format for bulk save
      const backendNodes = nodes.map(node => ({
        node_id: node.id,
        type: node.type || node.data.type,
        position_x: node.position.x,
        position_y: node.position.y,
        config_data: node.data.data
      }));
      
      const backendEdges = edges.map(edge => ({
        edge_id: edge.id,
        source_node_id: edge.source,
        target_node_id: edge.target
      }));
      
      await ApiService.saveCanvasState({
        canvas_id: canvas.id,
        nodes: backendNodes,
        edges: backendEdges
      });
      
      console.log('Canvas saved successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save canvas';
      setError(errorMessage);
      console.error('Error saving canvas:', err);
    } finally {
      setLoading(false);
    }
  }, [canvas, nodes, edges]);

  // Add a new node
  const addNode = useCallback(async (node: DatablockNode) => {
    if (!canvas) return;
    
    try {
      const backendNode = convertFrontendNodeToBackend(node, canvas.id);
      await ApiService.createNode(backendNode);
      
      // Update local state
      setNodes(prev => [...prev, node]);
      console.log('Node added:', node);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add node';
      setError(errorMessage);
      console.error('Error adding node:', err);
    }
  }, [canvas, convertFrontendNodeToBackend]);

  // Update a node
  const updateNode = useCallback(async (nodeId: string, updates: Partial<DatablockNode>) => {
    try {
      // Find the node in local state to get its backend ID
      const nodeIndex = nodes.findIndex(n => n.id === nodeId);
      if (nodeIndex === -1) return;
      
      const currentNode = nodes[nodeIndex];
      const updatedNode = { ...currentNode, ...updates };
      
      // Prepare backend update request
      const backendUpdates: UpdateNodeRequest = {};
      if (updates.position) {
        backendUpdates.position_x = updates.position.x;
        backendUpdates.position_y = updates.position.y;
      }
      if (updates.data) {
        backendUpdates.config_data = updates.data.data;
        backendUpdates.label = updates.data.label;
      }
      if (updates.selected !== undefined) {
        backendUpdates.is_selected = updates.selected;
      }
      if (updates.dragging !== undefined) {
        backendUpdates.is_dragging = updates.dragging;
      }
      
      // Note: We would need to store the backend node ID to make this work properly
      // For now, we'll just update local state
      setNodes(prev => prev.map((node, index) => 
        index === nodeIndex ? updatedNode : node
      ));
      
      console.log('Node updated:', updatedNode);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update node';
      setError(errorMessage);
      console.error('Error updating node:', err);
    }
  }, [nodes]);

  // Remove a node
  const removeNode = useCallback(async (nodeId: string) => {
    try {
      // Note: We would need to store the backend node ID to make this work properly
      // For now, we'll just update local state
      setNodes(prev => prev.filter(node => node.id !== nodeId));
      
      // Also remove any edges connected to this node
      setEdges(prev => prev.filter(edge => 
        edge.source !== nodeId && edge.target !== nodeId
      ));
      
      console.log('Node removed:', nodeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove node';
      setError(errorMessage);
      console.error('Error removing node:', err);
    }
  }, []);

  // Add a new edge
  const addEdge = useCallback(async (edge: DatablockEdge) => {
    if (!canvas) return;
    
    try {
      const backendEdge = convertFrontendEdgeToBackend(edge, canvas.id);
      await ApiService.createEdge(backendEdge);
      
      // Update local state
      setEdges(prev => [...prev, edge]);
      console.log('Edge added:', edge);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add edge';
      setError(errorMessage);
      console.error('Error adding edge:', err);
    }
  }, [canvas, convertFrontendEdgeToBackend]);

  // Remove an edge
  const removeEdge = useCallback(async (edgeId: string) => {
    try {
      // Note: We would need to store the backend edge ID to make this work properly
      // For now, we'll just update local state
      setEdges(prev => prev.filter(edge => edge.id !== edgeId));
      
      console.log('Edge removed:', edgeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove edge';
      setError(errorMessage);
      console.error('Error removing edge:', err);
    }
  }, []);

  // Load canvas on mount
  useEffect(() => {
    if (processId) {
      loadCanvas();
    }
  }, [processId, loadCanvas]);

  return {
    canvas,
    nodes,
    edges,
    loading,
    error,
    
    createCanvas,
    loadCanvas,
    saveCanvas,
    
    addNode,
    updateNode,
    removeNode,
    
    addEdge,
    removeEdge,
    
    setNodes,
    setEdges
  };
};
