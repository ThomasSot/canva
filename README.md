# Data Flow Canvas - Diagram Builder

Un editor de diagramas interactivo construido con React, TypeScript y React Flow que permite crear diagramas de flujo de datos con tres tipos de entidades: CSV, Process y Function.

## 🚀 Características

- **Drag & Drop**: Arrastra componentes desde el sidebar al canvas
- **Conexiones Interactivas**: Conecta entidades con líneas como en un diagrama SQL
- **Tres Tipos de Entidades**:
  - **CSV**: Fuentes de datos de archivos CSV
  - **Process**: Procesos de transformación de datos
  - **Function**: Funciones personalizadas u operaciones
- **Interfaz Moderna**: Diseño limpio con Tailwind CSS
- **Totalmente Tipado**: Construido con TypeScript para mejor desarrollo

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **React Flow** - Biblioteca para diagramas de nodos
- **Tailwind CSS** - Framework de CSS utilitario
- **Vite** - Herramienta de construcción rápida
- **Lucide React** - Iconos modernos

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd canva
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5174`

## 🎯 Cómo Usar

1. **Agregar Entidades**: Arrastra componentes desde el sidebar izquierdo al canvas
2. **Conectar Entidades**: Arrastra desde los puntos de conexión (handles) de una entidad a otra
3. **Mover Entidades**: Haz clic y arrastra las entidades para reorganizar el diagrama
4. **Zoom y Pan**: Usa los controles en la esquina inferior izquierda para navegar

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   └── Sidebar.tsx          # Panel lateral con entidades disponibles
├── nodes/
│   ├── CsvNode.tsx          # Componente de nodo CSV
│   ├── ProcessNode.tsx      # Componente de nodo Process
│   └── FunctionNode.tsx     # Componente de nodo Function
├── types.ts                 # Definiciones de tipos TypeScript
├── App.tsx                  # Componente principal
├── main.tsx                 # Punto de entrada
└── index.css               # Estilos globales
```

## 🎨 Personalización

### Agregar Nuevos Tipos de Entidades

1. Define el nuevo tipo en `src/types.ts`
2. Crea un nuevo componente de nodo en `src/nodes/`
3. Agrega el tipo al sidebar en `src/components/Sidebar.tsx`
4. Registra el componente en `src/App.tsx`

### Modificar Estilos

Los estilos están construidos con Tailwind CSS. Puedes modificar:
- Colores de las entidades en los componentes de nodos
- Layout del sidebar en `Sidebar.tsx`
- Estilos globales en `index.css`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter ESLint

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
