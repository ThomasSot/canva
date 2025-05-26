# Cómo Probar la Funcionalidad de CSV

## ✅ Funcionalidad Implementada

Ahora cuando cargas un CSV, automáticamente se muestra en el panel "Data Output" en la parte inferior de la aplicación.

## 🧪 Pasos para Probar

### Opción 1: Usar Datos de Ejemplo
1. Arrastra un bloque "Example Data" desde el sidebar al canvas
2. Haz clic en el bloque para seleccionarlo
3. ¡Los datos aparecerán automáticamente en el panel "Data Output"!

### Opción 2: Cargar CSV desde Texto
1. Arrastra un bloque "CSV Input" desde el sidebar al canvas
2. En el textarea del bloque, pega este CSV de ejemplo:
```csv
name,age,city,salary
Alice,30,New York,75000
Bob,25,San Francisco,85000
Charlie,35,Chicago,65000
Diana,28,New York,90000
```
3. Haz clic en el bloque para seleccionarlo
4. ¡Los datos aparecerán en el panel "Data Output"!

### Opción 3: Cargar CSV desde Archivo
1. Arrastra un bloque "CSV Input" desde el sidebar al canvas
2. Haz clic en "Upload CSV File"
3. Selecciona un archivo CSV de tu computadora
4. Haz clic en el bloque para seleccionarlo
5. ¡Los datos aparecerán en el panel "Data Output"!

## 📊 Qué Verás

En el panel "Data Output" verás:
- **Información del dataset**: tipo, número de filas y columnas
- **Tabla de datos**: con todas las filas y columnas
- **Botones de exportación**: para descargar como CSV o JSON
- **Logs en el terminal**: confirmando que los datos se cargaron correctamente

## 🔧 Funcionalidades Adicionales

- **Selección automática**: Al cargar datos, el nodo se actualiza automáticamente
- **Logs en tiempo real**: El terminal muestra mensajes cuando se cargan datos
- **Manejo de errores**: Si hay un error en el CSV, se muestra en el nodo
- **Exportación**: Puedes exportar los datos procesados como CSV o JSON

## 🎯 Próximos Pasos

Una vez que tengas datos cargados, puedes:
1. Conectar bloques de transformación (Filter, Group By, Sort)
2. Crear visualizaciones con el bloque "Data Table"
3. Usar el bloque "JavaScript" para transformaciones personalizadas

¡La aplicación está lista para usar! 🚀
