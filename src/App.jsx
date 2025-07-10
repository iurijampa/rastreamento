import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaPrint, FaCut, FaBoxOpen, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const supabase = createClient(
  'https://rifnoderpnfhsfrwygpa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZm5vZGVycG5maHNmcnd5Z3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjExNzgsImV4cCI6MjA2MzQzNzE3OH0.srcxrSsFU5aN38lKVmpLaW3QTyCOXzdIaPME4fpL_Q8'
);

function App() {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    const buscar = async () => {
      const { data } = await supabase
  .from('atividades')
  .select('cliente, pedido, status, setorAtual, dataEntregaCliente, dataEntrega, thumb')
  .eq('id', id)
  .single();


      setPedido(data);
      setLoading(false);
    };

    if (id) buscar();
    else setLoading(false);
  }, [id]);

  if (loading) return <p style={styles.loading}>Carregando...</p>;
  if (!pedido) return <p style={styles.loading}>Pedido não encontrado.</p>;

  return (
    <div style={styles.container}>
      <img src="/logo-stampblue.png" alt="Stamp BLUE" style={styles.logo} />

      <h2 style={styles.titulo}>
        Olá, <span style={styles.bold}>{pedido.cliente}</span>
      </h2>

      <p style={styles.subtitulo}>
        Seu pedido: <span style={styles.pedido}>{pedido.pedido}</span>
      </p>

      {pedido.thumb && (
        <img
          src={pedido.thumb}
          alt="Thumb do pedido"
          style={styles.thumb}
        />
      )}

      <div style={styles.card}>
        {[
          {
            label: 'Em produção',
            icon: <FaPrint />,
            chave: 'producao',
            setores: ['gabarito', 'impressao']
          },
          {
            label: 'Em confecção',
            icon: <FaCut />,
            chave: 'confeccao',
            setores: ['batida', 'costura']
          },
          {
            label: 'Pedido Pronto ✅',
            icon: <FaBoxOpen />,
            chave: 'embalado',
            setores: ['embalagem', 'finalizado']
          }
        ].map((etapa, index, arr) => {
          const atual = pedido.setorAtual?.toLowerCase() || '';
          const ativo = etapa.setores.some(s => atual.includes(s));
          const isLast = index === arr.length - 1;
          return (
            <div key={etapa.chave} style={{ opacity: ativo ? 1 : 0.3, marginBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  fontSize: 36,
                  color: ativo ? '#0f172a' : '#555',
                  marginBottom: 6
                }}>
                  {etapa.icon}
                </div>
                <p style={{
                  fontSize: 16,
                  fontWeight: ativo ? 700 : 500,
                  color: ativo ? '#0f172a' : '#555',
                  margin: 0
                }}>
                  {etapa.label}
                </p>
              </div>
              {!isLast && <span style={{ fontSize: 20, color: '#ccc' }}>↓</span>}
            </div>
          );
        })}
      </div>

      <p style={styles.entrega}>
        Previsão de entrega:
        <br />
        <span style={styles.dataEntrega}>
  {pedido.dataEntregaCliente
  ? new Date(pedido.dataEntregaCliente).toLocaleDateString('pt-BR')
  : pedido.dataEntrega
    ? new Date(pedido.dataEntrega).toLocaleDateString('pt-BR')
    : '-'}

</span>

      </p>

      <div style={styles.socialLinks}>
        <a href="https://www.instagram.com/stamp_personaliz/" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
          <FaInstagram />
        </a>
        <a href="https://wa.me/558396008807" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
          <FaWhatsapp />
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
    minHeight: '100vh',
    minWidth: '100vw',
    background: 'rgb(0, 47, 255)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },
  logo: {
    width: 120,
    marginBottom: 24
  },
  titulo: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8
  },
  bold: {
    fontWeight: 'bold'
  },
  subtitulo: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12
  },
  pedido: {
    fontWeight: 600
  },
  thumb: {
    width: '100%',
    maxWidth: 100,
    height: 'auto',
    borderRadius: 8,
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    marginBottom: 20
  },
  card: {
    background: '#f1f5f9',
    border: '2px solid #2563eb',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 20,
    width: '100%',
    maxWidth: '360px',
    boxShadow: '0 4px 10px #00000010',
    boxSizing: 'border-box'
  },
  entrega: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  dataEntrega: {
    fontSize: 25,
    fontWeight: 600,
    color: '#FFFFFF'
  },
  loading: {
    textAlign: 'center',
    marginTop: 100,
    fontFamily: 'Poppins, sans-serif',
    fontSize: 16,
    color: '#FFFFFF'
  },
  socialLinks: {
    display: 'flex',
    gap: 20,
    marginTop: 30
  },
  iconLink: {
    fontSize: 28,
    color: '#fff',
    background: '#0f172a',
    padding: 10,
    borderRadius: 50,
    textDecoration: 'none'
  }
};

export default App;
