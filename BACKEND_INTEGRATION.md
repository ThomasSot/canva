# Backend Integration - Datablock Editor

Este documento explica cómo se ha integrado el frontend del editor de bloques con el backend.

## Cambios Realizados

### 1. **Tipos TypeScript**
- ✅ Agregados tipos para la API de bloques en `src/types/index.ts`
- ✅ Tipos compatibles con ReactFlow y el backend

### 2. **Servicio API**
- ✅ Extendido `src/utils/api.ts` con métodos para la API de bloques
- ✅ Autenticación automática usando JWT del localStorage
- ✅ Manejo de errores y respuestas

### 3. **Hook Personalizado**
- ✅ Creado `src/hooks/useBlockCanvas.ts` para manejar la persistencia
- ✅ Conversión automática entre formatos frontend/backend
- ✅ Operaciones CRUD para canvas, nodos y conexiones

### 4. **Autenticación**
- ✅ Utilidades de auth en `src/utils/auth.ts`
- ✅ JWT token configurado automáticamente en localStorage
- ✅ Headers de autenticación en todas las requests

### 5. **Componente Principal**
- ✅ Modificado `DatablockEditor.tsx` para usar el hook
- ✅ Botón de guardar canvas
- ✅ Indicadores de carga y error
- ✅ Persistencia automática de nodos y conexiones

## Funcionalidades

### Canvas
- **Crear**: Se crea automáticamente al cargar si no existe
- **Cargar**: Se carga automáticamente al montar el componente
- **Guardar**: Botón manual para guardar estado completo

### Nodos
- **Agregar**: Se persiste automáticamente al arrastrar desde sidebar
- **Mover**: Se actualiza posición en tiempo real
- **Configurar**: Se guarda configuración al modificar

### Conexiones
- **Crear**: Se persiste automáticamente al conectar nodos
- **Eliminar**: Se elimina del backend al desconectar

## Configuración

### JWT Token
El token JWT se configura automáticamente en `localStorage`:
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1paWRvQGFkbWluLmNsIiwidXNlcl9pZCI6MSwiY29tcGFueV9pZCI6MTkwLCJpYXQiOjE3NDgwMjA3MTUsImV4cCI6MTc0ODAyNDMxNX0.fpKA240eBxUjb0cE9kU6e6fxHEJdS7EROV3OwIcmkbI';
```

### URL del Backend
Configurado en `src/utils/api.ts`:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

### Process ID
Por defecto usa `process_id = 1`. En una implementación real, esto vendría de:
- URL parameters
- Selección del usuario
- Contexto de la aplicación

## Uso

### 1. Iniciar Backend
```bash
cd backend-api
node run-block-migration.js  # Ejecutar migración
npm start                    # Iniciar servidor
```

### 2. Iniciar Frontend
```bash
cd canva
npm start
```

### 3. Usar Editor
1. **Arrastrar bloques** desde el sidebar al canvas
2. **Conectar nodos** arrastrando desde los handles
3. **Configurar nodos** haciendo click para seleccionar
4. **Guardar canvas** usando el botón "Save Canvas"

## API Endpoints Utilizados

### Canvas
- `POST /blocks/canvas` - Crear canvas
- `GET /blocks/canvas/process/:process_id` - Obtener canvas por proceso
- `GET /blocks/canvas/:canvas_id` - Obtener canvas completo

### Nodos
- `POST /blocks/nodes` - Crear nodo
- `PUT /blocks/nodes/:node_id` - Actualizar nodo
- `DELETE /blocks/nodes/:node_id` - Eliminar nodo

### Conexiones
- `POST /blocks/edges` - Crear conexión
- `DELETE /blocks/edges/:edge_id` - Eliminar conexión

### Estado
- `POST /blocks/canvas/state` - Guardar estado completo

## Estructura de Datos

### Frontend → Backend
Los nodos de ReactFlow se convierten automáticamente al formato del backend:
```javascript
// Frontend (ReactFlow)
{
  id: "input-csv-1234567890",
  type: "input-csv",
  position: { x: 100, y: 200 },
  data: { config: {...} }
}

// Backend
{
  canvas_id: 123,
  node_id: "input-csv-1234567890", 
  type: "input-csv",
  position_x: 100,
  position_y: 200,
  config_data: {...}
}
```

### Backend → Frontend
Los datos del backend se convierten automáticamente para ReactFlow:
```javascript
// Backend
{
  id: 456,
  node_id: "input-csv-1234567890",
  position_x: 100,
  position_y: 200,
  config_data: {...}
}

// Frontend (ReactFlow)
{
  id: "input-csv-1234567890",
  type: "input-csv", 
  position: { x: 100, y: 200 },
  data: { config: {...} }
}
```

## Próximos Pasos

1. **Optimización**: Implementar debouncing para actualizaciones
2. **Offline**: Manejar estado offline con sincronización
3. **Colaboración**: Múltiples usuarios editando el mismo canvas
4. **Versionado**: Historial de cambios y rollback
5. **Validación**: Validación de esquemas de datos en tiempo real

## Troubleshooting

### Error de CORS
Asegúrate de que el backend tenga CORS configurado para `http://localhost:3000`

### Token Expirado
El token se renueva automáticamente. Si hay problemas, limpia localStorage:
```javascript
localStorage.removeItem('jwt');
```

### Canvas No Carga
Verifica que:
1. El backend esté corriendo en puerto 3000
2. Las tablas de block estén creadas
3. El process_id exista en la base de datos
