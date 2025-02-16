import React, { useEffect, useRef } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewWidgetProps {
  symbol: string;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol }) => {
  const container = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (container.current) {
        new window.TradingView.widget({
          container_id: container.current.id,
          symbol: symbol,
          interval: 'D',
          timezone: 'Europe/Berlin',
          theme: 'dark',
          style: '1',
          locale: 'de_DE',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: isMobile,
          hide_volume: isMobile,
          allow_symbol_change: true,
          save_image: false,
          height: isMobile ? 400 : 600,
          width: '100%',
          studies: ['RSI@tv-basicstudies'],
          disabled_features: [
            'use_localstorage_for_settings',
            isMobile && 'left_toolbar',
            isMobile && 'volume_force_overlay'
          ].filter(Boolean)
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, isMobile]);

  return (
    <Box 
      sx={{ 
        width: '100%',
        height: isMobile ? '400px' : '600px',
        overflow: 'hidden',
        borderRadius: 1
      }}
    >
      <div id="tradingview_widget" ref={container} style={{ height: '100%', width: '100%' }} />
    </Box>
  );
};

export default TradingViewWidget; 