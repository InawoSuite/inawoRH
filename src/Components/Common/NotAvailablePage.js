import React from 'react';
import { Box, Typography } from '@mui/material'; // Si vous utilisez Material-UI
import image from '../../assets/images/developpement-nouvelle-application-bureau.png'; // Chemin de votre image

const NotAvailablePage = ({ description }) => {
  return (
    <Box 
      sx={{
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center',
        padding: 3
      }}
    >
      <img 
        src={image}
        alt="Page non disponible"
        style={{ 
          width: '300px', 
          height: '300px',
          marginBottom: '5px'
        }}
      />
      <Typography variant="h5" gutterBottom style={{ color: 'rgb(98,116,100)', fontSize: '18px',fontFamily: 'Poppins,sans-serif' }}>
        Fonctionnalité bientôt disponible
      </Typography>
      <Typography variant="body1" style={{ color: 'var(--vz-vertical-menu-sub-item-color)', fontSize: '13px' , fontWeight: '100',fontFamily: 'Poppins,sans-serif' }}>
        Les fonctionnalités de cette page ne sont pas encore disponibles. 
      </Typography>
      {description && (
        <Typography variant="body1" style={{ color: 'var(--vz-vertical-menu-sub-item-color)' , fontSize: '13px',fontWeight: '100',fontFamily: 'Poppins,sans-serif' }} >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default NotAvailablePage;