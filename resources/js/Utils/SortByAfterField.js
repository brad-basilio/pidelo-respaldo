const SortByAfterField = (components) => {
  // Crear un mapa con los componentes por ID para búsquedas rápidas
  const componentMap = Object.fromEntries(components.map(c => [c.id, c]));

  // Conjunto para almacenar los IDs de los componentes ya procesados
  const processedIds = new Set();

  // Listas para almacenar los componentes ordenados y los de referencia faltante
  const ordered = [];
  const missingReferences = new Set();

  // Función recursiva para agregar un componente y sus dependencias
  function addComponent(component) {
    if (processedIds.has(component.id)) return; // Evitar duplicados

    if (component.after_component) {
      const dependency = componentMap[component.after_component];
      if (dependency) {
        addComponent(dependency); // Agregar la dependencia primero
      } else {
        // Si la referencia no existe, marcarlo para procesarlo al final
        missingReferences.add(component);
        return;
      }
    }

    // Agregar el componente actual al orden y marcarlo como procesado
    ordered.push(component);
    processedIds.add(component.id);
  }

  // Procesar todos los componentes
  components.forEach(component => {
    addComponent(component);
  });

  // Ordenar los componentes con referencias faltantes por `created_at`
  const sortedMissingReferences = Array.from(missingReferences)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .filter(x => !processedIds.has(x.id)); // Filtrar los que ya se han procesado

  // Combinar el orden principal con los faltantes
  return [...ordered, ...sortedMissingReferences];
}

export default SortByAfterField;

