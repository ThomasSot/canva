// API configuration and service functions
import {
  BlockCanvas,
  CompleteCanvas,
  CreateCanvasRequest,
  CreateCanvasResponse,
  CreateNodeRequest,
  CreateNodeResponse,
  UpdateNodeRequest,
  CreateEdgeRequest,
  CreateEdgeResponse,
  SaveCanvasStateRequest
} from '../types';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this to match your backend URL

export interface UploadResponse {
  message: string;
  path: string;
  file_name: string;
  original_name: string;
}

export interface ProcessResponse {
  message: string;
  dataframe_id: number;
  name: string;
  columns: Array<{
    id: number;
    name: string;
    type: string;
  }>;
  rows_count: number;
}

export class ApiService {
  private static getAuthHeaders(): HeadersInit {
    // Get JWT token from localStorage
    const jwt = localStorage.getItem('jwt');
    return {
      'Content-Type': 'application/json',
      ...(jwt && { 'auth': jwt })
    };
  }

  private static getCompanyIdFromToken(): number {
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) return 1; // fallback to company_id 1

      // Decode JWT payload (second part of the token)
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return payload.company_id || 1;
    } catch (error) {
      console.warn('Error decoding JWT token:', error);
      return 1; // fallback to company_id 1
    }
  }

  /**
   * Upload a CSV file to the backend
   */
  static async uploadCsvFile(file: File, companyId?: number): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('csvFile', file);

    // Use company_id from token if not provided
    const actualCompanyId = companyId || this.getCompanyIdFromToken();

    // Get JWT token for authentication
    const jwt = localStorage.getItem('jwt');

    const response = await fetch(`${API_BASE_URL}/dataframes/upload/${actualCompanyId}`, {
      method: 'POST',
      body: formData,
      headers: {
        // Add authentication header if JWT exists
        ...(jwt && { 'auth': jwt })
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Process an uploaded CSV file to create a dataframe
   */
  static async processCsvFile(
    fileName: string,
    originalName: string,
    dataframeName?: string,
    companyId?: number
  ): Promise<ProcessResponse> {
    // Use company_id from token if not provided
    const actualCompanyId = companyId || this.getCompanyIdFromToken();

    const response = await fetch(`${API_BASE_URL}/dataframes/process/${actualCompanyId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        file_name: fileName,
        original_name: originalName,
        dataframe_name: dataframeName
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Processing failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get dataframes by company
   */
  static async getDataFramesByCompany(companyId?: number) {
    // Use company_id from token if not provided
    const actualCompanyId = companyId || this.getCompanyIdFromToken();

    const response = await fetch(`${API_BASE_URL}/dataframes/company/${actualCompanyId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get a specific dataframe by ID
   */
  static async getDataFrameById(dataframeId: number) {
    const response = await fetch(`${API_BASE_URL}/dataframes/${dataframeId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ===== BLOCK EDITOR API METHODS =====

  /**
   * Create a new canvas for a process
   */
  static async createCanvas(request: CreateCanvasRequest): Promise<CreateCanvasResponse> {
    const response = await fetch(`${API_BASE_URL}/blocks/canvas`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Canvas creation failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get canvas by process ID
   */
  static async getCanvasByProcessId(processId: number): Promise<BlockCanvas[]> {
    const response = await fetch(`${API_BASE_URL}/blocks/canvas/process/${processId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to get canvas' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get complete canvas with nodes and edges
   */
  static async getCompleteCanvas(canvasId: number): Promise<CompleteCanvas> {
    const response = await fetch(`${API_BASE_URL}/blocks/canvas/${canvasId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to get complete canvas' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create a new node
   */
  static async createNode(request: CreateNodeRequest): Promise<CreateNodeResponse> {
    const response = await fetch(`${API_BASE_URL}/blocks/nodes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Node creation failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Update a node
   */
  static async updateNode(nodeId: number, request: UpdateNodeRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/blocks/nodes/${nodeId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Node update failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Delete a node
   */
  static async deleteNode(nodeId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/blocks/nodes/${nodeId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Node deletion failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create a new edge
   */
  static async createEdge(request: CreateEdgeRequest): Promise<CreateEdgeResponse> {
    const response = await fetch(`${API_BASE_URL}/blocks/edges`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Edge creation failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Delete an edge
   */
  static async deleteEdge(edgeId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/blocks/edges/${edgeId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Edge deletion failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Save complete canvas state
   */
  static async saveCanvasState(request: SaveCanvasStateRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/blocks/canvas/state`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Canvas state save failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export default ApiService;
