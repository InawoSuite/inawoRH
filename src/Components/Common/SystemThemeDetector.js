// components/SystemThemeDetector.js
import React, { useEffect } from 'react';
import { layoutModeTypes } from "../constants/layout";

const SystemThemeDetector = ({ onChangeLayoutMode }) => {
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e) => {
            const newSystemTheme = e.matches 
                ? layoutModeTypes['DARKMODE'] 
                : layoutModeTypes['LIGHTMODE'];
            
            // Appliquer automatiquement le thème système
            onChangeLayoutMode(newSystemTheme);
        };

        // Détection initiale
        handleSystemThemeChange(mediaQuery);

        // Écouter les changements
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            mediaQuery.addListener(handleSystemThemeChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleSystemThemeChange);
            } else {
                mediaQuery.removeListener(handleSystemThemeChange);
            }
        };
    }, [onChangeLayoutMode]);
    return null; // Ce composant ne rend rien visuellement
};

export default SystemThemeDetector;