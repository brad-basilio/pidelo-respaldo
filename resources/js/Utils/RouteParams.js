const RouteParams = (ruta) => {
  const regex = /{([^}]+)}/g;
  const resultado = [];
  let coincidencia;

  while ((coincidencia = regex.exec(ruta)) !== null) {
    resultado.push(coincidencia[1]);
  }

  return resultado;
}

export default RouteParams