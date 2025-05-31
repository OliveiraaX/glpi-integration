// Função para mapear o status de um item com base em seu código numérico
function mapStatus(status) {
  const statuses = {
    1: 'Novo',
    2: 'Em andamento (atribuído)',
    3: 'Em andamento (planejado)',
    4: 'Pendente',
    5: 'Resolvido',
    6: 'Fechado'
  };
  // Retorna a descrição correspondente ao código ou 'Desconhecido' se o código não estiver mapeado
  return statuses[status] || 'Desconhecido';
}

// Função para mapear a prioridade de um item com base em seu código numérico
function mapPriority(priority) {
  const priorities = {
    1: 'Muito baixa',
    2: 'Baixa',
    3: 'Média',
    4: 'Alta',
    5: 'Muito alta'
  };
  // Retorna a descrição correspondente ao código ou 'Desconhecida' se o código não estiver mapeado
  return priorities[priority] || 'Desconhecida';
}

// Exporta as funções mapStatus e mapPriority para que possam ser utilizadas em outros arquivos
module.exports = { mapStatus, mapPriority };
