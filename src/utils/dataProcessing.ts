import * as _ from 'lodash';
import Papa from 'papaparse';
import { DataRow, DataSet, FilterConfig, GroupConfig, SortConfig } from '../types';

export const parseCSV = (csvText: string): Promise<DataSet> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
        } else {
          const data = results.data as DataRow[];
          const columns = results.meta.fields || [];
          resolve({
            data,
            columns,
            type: 'tabular'
          });
        }
      },
      error: (error) => reject(error)
    });
  });
};

export const parseJSON = (jsonText: string): DataSet => {
  try {
    const parsed = JSON.parse(jsonText);
    
    if (Array.isArray(parsed)) {
      const columns = parsed.length > 0 ? Object.keys(parsed[0]) : [];
      return {
        data: parsed,
        columns,
        type: 'tabular'
      };
    } else {
      return {
        data: [parsed],
        columns: Object.keys(parsed),
        type: 'json'
      };
    }
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const filterData = (dataset: DataSet, config: FilterConfig): DataSet => {
  const { column, operator, value } = config;
  
  const filteredData = dataset.data.filter(row => {
    const cellValue = row[column];
    
    switch (operator) {
      case 'equals':
        return cellValue == value;
      case 'not_equals':
        return cellValue != value;
      case 'greater_than':
        return Number(cellValue) > Number(value);
      case 'less_than':
        return Number(cellValue) < Number(value);
      case 'contains':
        return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
      case 'not_contains':
        return !String(cellValue).toLowerCase().includes(String(value).toLowerCase());
      default:
        return true;
    }
  });

  return {
    ...dataset,
    data: filteredData
  };
};

export const groupData = (dataset: DataSet, config: GroupConfig): DataSet => {
  const { column, aggregation } = config;
  
  const grouped = _.groupBy(dataset.data, column);
  
  const result = Object.keys(grouped).map(key => {
    const group = grouped[key];
    const baseRow = { [column]: key };
    
    if (aggregation) {
      const { column: aggColumn, operation } = aggregation;
      const values = group.map(row => Number(row[aggColumn])).filter(v => !isNaN(v));
      
      let aggregatedValue;
      switch (operation) {
        case 'sum':
          aggregatedValue = _.sum(values);
          break;
        case 'count':
          aggregatedValue = group.length;
          break;
        case 'avg':
          aggregatedValue = _.mean(values);
          break;
        case 'min':
          aggregatedValue = _.min(values);
          break;
        case 'max':
          aggregatedValue = _.max(values);
          break;
        default:
          aggregatedValue = group.length;
      }
      
      baseRow[`${operation}_${aggColumn}`] = aggregatedValue;
    } else {
      baseRow['count'] = group.length;
    }
    
    return baseRow;
  });

  const newColumns = aggregation 
    ? [column, `${aggregation.operation}_${aggregation.column}`]
    : [column, 'count'];

  return {
    data: result,
    columns: newColumns,
    type: 'tabular'
  };
};

export const sortData = (dataset: DataSet, config: SortConfig): DataSet => {
  const { column, direction } = config;
  
  const sortedData = _.orderBy(dataset.data, [column], [direction]);
  
  return {
    ...dataset,
    data: sortedData
  };
};

export const mergeData = (dataset1: DataSet, dataset2: DataSet, joinColumn: string): DataSet => {
  const mergedData = dataset1.data.map(row1 => {
    const matchingRow = dataset2.data.find(row2 => row2[joinColumn] === row1[joinColumn]);
    return matchingRow ? { ...row1, ...matchingRow } : row1;
  });

  const allColumns = _.uniq([...dataset1.columns, ...dataset2.columns]);

  return {
    data: mergedData,
    columns: allColumns,
    type: 'tabular'
  };
};

export const executeJavaScript = (code: string, inputData: any): any => {
  try {
    // Create a safe execution context
    const func = new Function('_', 'data', `
      ${code}
      if (typeof transform === 'function') {
        return transform(data);
      } else {
        return data;
      }
    `);
    
    return func(_, inputData);
  } catch (error) {
    throw new Error(`JavaScript execution error: ${error.message}`);
  }
};

export const getExampleData = (): DataSet => {
  return {
    data: [
      { id: 1, name: 'Alice', age: 30, city: 'New York', salary: 75000 },
      { id: 2, name: 'Bob', age: 25, city: 'San Francisco', salary: 85000 },
      { id: 3, name: 'Charlie', age: 35, city: 'Chicago', salary: 65000 },
      { id: 4, name: 'Diana', age: 28, city: 'New York', salary: 90000 },
      { id: 5, name: 'Eve', age: 32, city: 'San Francisco', salary: 95000 },
      { id: 6, name: 'Frank', age: 29, city: 'Chicago', salary: 70000 },
      { id: 7, name: 'Grace', age: 31, city: 'New York', salary: 80000 },
      { id: 8, name: 'Henry', age: 27, city: 'San Francisco', salary: 88000 }
    ],
    columns: ['id', 'name', 'age', 'city', 'salary'],
    type: 'tabular'
  };
};
