// Projeto 2 · Agenda de contatos: dados de exemplo.
// Copie este arquivo para src/data/contatos.js do seu repositório agenda-de-contatos.
// Nomes, telefones e e-mails são fictícios.
//
// Contato: { id, nome, telefone, email, aniversario, grupo }
// - aniversario: texto 'AAAA-MM-DD', ou '' quando não foi informado
// - email: texto, ou '' quando não foi informado
// - grupo: 'familia', 'amigos' ou 'trabalho'

export const grupos = [
  { slug: 'familia', nome: 'Família' },
  { slug: 'amigos', nome: 'Amigos' },
  { slug: 'trabalho', nome: 'Trabalho' },
];

export const contatos = [
  {
    id: 1,
    nome: 'Mariana Souza',
    telefone: '(11) 98765-4321',
    email: 'mariana.souza@exemplo.com',
    aniversario: '1998-10-30',
    grupo: 'amigos',
  },
  {
    id: 2,
    nome: 'Bruno Carvalho',
    telefone: '(21) 99812-3344',
    email: 'bruno.carvalho@exemplo.com',
    aniversario: '1995-03-14',
    grupo: 'amigos',
  },
  {
    id: 3,
    nome: 'Helena Martins',
    telefone: '(11) 3456-7890',
    email: 'helena.martins@exemplo.com',
    aniversario: '1962-07-02',
    grupo: 'familia',
  },
  {
    id: 4,
    nome: 'Álvaro Mendes',
    telefone: '(31) 98877-1020',
    email: 'alvaro.mendes@empresa.exemplo.com',
    aniversario: '1984-01-21',
    grupo: 'trabalho',
  },
  {
    id: 5,
    nome: 'Juliana Ribeiro',
    telefone: '(11) 97654-3210',
    email: 'juliana.ribeiro@empresa.exemplo.com',
    aniversario: '1990-10-08',
    grupo: 'trabalho',
  },
  {
    id: 6,
    nome: 'Rafael Gomes',
    telefone: '(41) 99123-8765',
    email: 'rafa.gomes@exemplo.com',
    aniversario: '2001-05-17',
    grupo: 'amigos',
  },
  {
    id: 7,
    nome: 'Ana Beatriz Costa',
    telefone: '(11) 99234-5678',
    email: 'anabia@exemplo.com',
    aniversario: '2003-12-05',
    grupo: 'familia',
  },
  {
    id: 8,
    nome: 'Gustavo Pereira',
    telefone: '(11) 98123-4567',
    email: 'gustavo.pereira@empresa.exemplo.com',
    aniversario: '1979-08-29',
    grupo: 'trabalho',
  },
  {
    id: 9,
    nome: 'Fernanda Lima',
    telefone: '(51) 98456-1122',
    email: '',
    aniversario: '1997-03-03',
    grupo: 'amigos',
  },
  {
    id: 10,
    nome: 'Érica Nogueira',
    telefone: '(11) 99876-5401',
    email: 'erica.nogueira@exemplo.com',
    aniversario: '1965-02-11',
    grupo: 'familia',
  },
  {
    id: 11,
    nome: 'Daniel Rocha',
    telefone: '(21) 98765-0099',
    email: 'daniel.rocha@exemplo.com',
    aniversario: '',
    grupo: 'amigos',
  },
  {
    id: 12,
    nome: 'Carla Dias',
    telefone: '(11) 97788-6655',
    email: 'carla.dias@empresa.exemplo.com',
    aniversario: '1988-06-24',
    grupo: 'trabalho',
  },
  {
    id: 13,
    nome: 'João Pedro Alves',
    telefone: '(85) 99654-3388',
    email: 'joaopedro@exemplo.com',
    aniversario: '1999-09-12',
    grupo: 'amigos',
  },
  {
    id: 14,
    nome: 'Paula Fernandes',
    telefone: '(11) 99345-2211',
    email: 'paula.fernandes@exemplo.com',
    aniversario: '1993-04-27',
    grupo: 'familia',
  },
  {
    id: 15,
    nome: 'Marcos Teixeira',
    telefone: '(61) 98234-7766',
    email: 'marcos.teixeira@empresa.exemplo.com',
    aniversario: '1986-11-19',
    grupo: 'trabalho',
  },
];
