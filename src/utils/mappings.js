function mapStatus(status) {
  const statuses = {
    1: 'Novo',
    2: 'Em andamento (atribuído)',
    3: 'Em andamento (planejado)',
    4: 'Pendente',
    5: 'Resolvido',
    6: 'Fechado'
  };
  return statuses[status] || 'Desconhecido';
}

function mapPriority(priority) {
  const priorities = {
    1: 'Muito baixa',
    2: 'Baixa',
    3: 'Média',
    4: 'Alta',
    5: 'Muito alta'
  };
  return priorities[priority] || 'Desconhecida';
}

module.exports = { mapStatus, mapPriority };
