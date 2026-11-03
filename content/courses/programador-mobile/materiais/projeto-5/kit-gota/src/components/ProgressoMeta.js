// ProgressoMeta: o cartão com o total do dia, a barra e quanto falta para a meta.
// Props:
//   total: quantos ml você já bebeu hoje (número)
//   meta: a meta do dia, em ml (número)
// Exemplo: <ProgressoMeta total={800} meta={2000} /> mostra 800 ml de 2000 ml, 40% e Faltam 1200 ml.
import { StyleSheet, Text, View } from 'react-native';
import { cantos, cores, espacos } from '../tema';

export default function ProgressoMeta({ total, meta }) {
  // arredonda para baixo: só mostra 100% quando a meta foi mesmo batida
  const percentual = meta > 0 ? Math.floor((total / meta) * 100) : 0;
  const falta = meta - total;
  // a barra para no fim do trilho, mesmo passando da meta
  let largura = 0;
  if (percentual > 100) {
    largura = 100;
  } else if (percentual > 0) {
    largura = percentual;
  }

  return (
    <View style={estilos.cartao}>
      <View style={estilos.linha}>
        <Text style={estilos.total}>{total} ml</Text>
        <Text style={estilos.meta}>de {meta} ml</Text>
      </View>
      <View style={estilos.trilho}>
        <View style={[estilos.preenchimento, { width: `${largura}%` }]} />
      </View>
      <View style={estilos.linha}>
        <Text style={estilos.detalhe}>{percentual}% da meta</Text>
        <Text style={estilos.detalhe}>{falta > 0 ? `Faltam ${falta} ml` : 'Meta batida!'}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: cantos.grande,
    padding: espacos.grande,
    gap: espacos.medio,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  total: {
    fontSize: 32,
    fontWeight: 'bold',
    color: cores.agua,
  },
  meta: {
    fontSize: 16,
    color: cores.textoFraco,
    marginBottom: espacos.pequeno,
  },
  trilho: {
    height: 16,
    backgroundColor: cores.aguaClara,
    borderRadius: cantos.pequeno,
    overflow: 'hidden',
  },
  preenchimento: {
    height: 16,
    backgroundColor: cores.agua,
    borderRadius: cantos.pequeno,
  },
  detalhe: {
    fontSize: 14,
    color: cores.textoFraco,
  },
});
