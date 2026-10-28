// E31: cores, espaços, fontes e raios; E32: familia; E33: a cor alerta nos dois temas
export const cores = {
  claro: {
    fundo: '#f8fafc', superficie: '#ffffff', borda: '#e2e8f0',
    texto: '#0f172a', textoSuave: '#475569',
    primaria: '#6d28d9', perigo: '#b91c1c', sucesso: '#15803d',
    alerta: '#b45309',
  },
  escuro: {
    fundo: '#0f172a', superficie: '#1e293b', borda: '#334155',
    texto: '#f1f5f9', textoSuave: '#94a3b8',
    primaria: '#a78bfa', perigo: '#f87171', sucesso: '#4ade80',
    alerta: '#fbbf24',
  },
};

export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const fonte = { pequena: 12, corpo: 16, titulo: 20, destaque: 28 };

export const raio = { sm: 6, md: 12, lg: 20 };

export const familia = {
  regular: 'Inter_400Regular',
  negrito: 'Inter_700Bold',
};
