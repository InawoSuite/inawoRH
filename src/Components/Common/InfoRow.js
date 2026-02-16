const InfoRow = ({ label, value, style = {} }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
    fontSize: '14px',
    ...style
  }}>
    <span style={{ fontWeight: '500', color: '#495057' }}>{label}</span>
    <span style={{ fontWeight: 'bold', color: '#212529' }}>{value}</span>
  </div>
);

export default InfoRow;