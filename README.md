# Canva Datablocks

Un editor basado en nodos para explorar, analizar y transformar datos sin código, inspirado en los datablocks de WBKD.

## 🚀 Características

### Bloques de Entrada
- **CSV Input**: Carga datos desde archivos CSV o texto
- **JSON Input**: Carga datos desde archivos JSON o texto  
- **Example Data**: Dataset de ejemplo para pruebas

### Bloques de Transformación
- **Filter**: Filtra filas basado en condiciones
- **Group By**: Agrupa datos y aplica agregaciones
- **Sort**: Ordena datos por valores de columna
- **JavaScript**: Transformaciones personalizadas con código

### Bloques de Visualización
- **Data Table**: Muestra datos en formato de tabla
- **Chart**: Crea gráficos y visualizaciones (próximamente)

### Características Adicionales
- **Editor Visual**: Interfaz drag-and-drop basada en React Flow
- **Vista de Datos**: Panel para inspeccionar salidas de nodos
- **Terminal**: Logs y mensajes del sistema
- **Exportación**: Exporta datos a CSV o JSON

## 🛠️ Tecnologías

- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **React Flow** - Editor de nodos
- **Vite** - Build tool y dev server
- **Lodash** - Utilidades de datos
- **Papa Parse** - Parser de CSV
- **Lucide React** - Iconos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd canva-datablocks

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🎯 Uso

1. **Agregar Bloques**: Arrastra bloques desde el sidebar al canvas
2. **Conectar Bloques**: Conecta las salidas con las entradas para crear flujos de datos
3. **Configurar Bloques**: Haz clic en un bloque para configurar sus parámetros
4. **Ver Resultados**: Selecciona un bloque para ver su salida en el panel de datos
5. **Exportar**: Usa los botones de exportación para descargar los resultados

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── blocks/           # Componentes de bloques individuales
│   ├── DatablockEditor.tsx  # Editor principal
│   ├── Sidebar.tsx       # Panel lateral con bloques
│   ├── DataView.tsx      # Vista de datos
│   └── Terminal.tsx      # Terminal/consola
├── types/               # Definiciones de tipos TypeScript
├── utils/               # Utilidades para procesamiento de datos
└── styles/              # Archivos CSS
```

## 🔧 Desarrollo

### Agregar Nuevos Bloques

1. Crear componente en `src/components/blocks/`
2. Agregar tipo en `src/types/index.ts`
3. Registrar en `nodeTypes` en `DatablockEditor.tsx`
4. Agregar definición en `Sidebar.tsx`

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linting con ESLint

## 🎨 Personalización

El proyecto usa CSS modules y variables CSS para facilitar la personalización de temas y estilos.

## 📝 Próximas Características

- [ ] Más tipos de visualizaciones (gráficos de barras, líneas, etc.)
- [ ] Bloques de geocodificación
- [ ] Soporte para más formatos de datos
- [ ] Guardado y carga de flujos
- [ ] Colaboración en tiempo real
- [ ] Más operaciones de transformación

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- Inspirado en [datablocks](https://datablocks.pro/) de WBKD
- Construido con [React Flow](https://reactflow.dev/)
- Iconos de [Lucide](https://lucide.dev/)
