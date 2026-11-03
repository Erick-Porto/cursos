// Briefing 1 · Agenda de serviços: os dados fixos do salão do bairro.
// E41: apague este arquivo se a equipe escolheu outro briefing.
//
// Cada serviço:
// {
//   id: 1,                    número único
//   nome: 'Corte de cabelo',
//   duracao: 30,              em minutos
//   preco: 4500,              em centavos: 4500 é R$ 45,00 (use formatarReais, de '@/utils')
//   descricao: '...',
//   icone: 'cut-outline',     nome de um ícone do Ionicons
// }
//
// Cada agendamento:
// {
//   id: 1,
//   servicoId: 1,             o id do serviço
//   servico: 'Corte de cabelo',
//   dia: 'Segunda',           um dos dias abaixo
//   hora: '10:00',            um dos horários abaixo
//   cliente: 'Ana Souza',
// }
// Regra do briefing: um horário está ocupado quando já existe um agendamento com o mesmo dia e a mesma hora.

export const servicos = [
  {
    id: 1,
    nome: 'Corte de cabelo',
    duracao: 30,
    preco: 4500,
    descricao: 'Corte na máquina e na tesoura, com lavagem.',
    icone: 'cut-outline',
  },
  {
    id: 2,
    nome: 'Barba',
    duracao: 30,
    preco: 3000,
    descricao: 'Barba na navalha, com toalha quente.',
    icone: 'brush-outline',
  },
  {
    id: 3,
    nome: 'Corte e barba',
    duracao: 60,
    preco: 7000,
    descricao: 'O corte e a barba no mesmo horário.',
    icone: 'cut-outline',
  },
  {
    id: 4,
    nome: 'Escova',
    duracao: 45,
    preco: 5000,
    descricao: 'Lavagem e escova modelada.',
    icone: 'water-outline',
  },
  {
    id: 5,
    nome: 'Manicure',
    duracao: 45,
    preco: 3500,
    descricao: 'Cutícula, lixa e esmalte.',
    icone: 'hand-left-outline',
  },
  {
    id: 6,
    nome: 'Sobrancelha',
    duracao: 15,
    preco: 2000,
    descricao: 'Design de sobrancelha na pinça.',
    icone: 'eye-outline',
  },
];

// O salão abre de segunda a sábado, com um atendimento por horário.
export const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const horarios = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Agendamentos para as telas não começarem vazias.
export const agendamentosDeExemplo = [
  { id: 1, servicoId: 1, servico: 'Corte de cabelo', dia: 'Segunda', hora: '10:00', cliente: 'Ana Souza' },
  { id: 2, servicoId: 3, servico: 'Corte e barba', dia: 'Segunda', hora: '14:00', cliente: 'Bruno Lima' },
  { id: 3, servicoId: 5, servico: 'Manicure', dia: 'Quarta', hora: '09:00', cliente: 'Carla Dias' },
];
