/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';

const faviconSrc = `${process.env.PUBLIC_URL || ''}/favicon.svg`;

const WebMonitorLogo = ({
  size = 40,
  primaryColor = '#10b981',
  secondaryColor = '#059669',
  showPulse = false,
  ...props
}) => {
  return (
    <Box
      component="img"
      src={faviconSrc}
      alt="WebMonitor"
      sx={{
        display: 'block',
        width: size,
        height: size,
        objectFit: 'contain',
        ...props.sx,
      }}
    />
  );
};

const WebMonitorLogoIcon = ({
  size = 24,
  color = '#ffffff',
  ...props
}) => {
  return (
    <Box
      component="img"
      src={faviconSrc}
      alt="WebMonitor"
      sx={{
        display: 'block',
        width: size,
        height: size,
        objectFit: 'contain',
        ...props.sx,
      }}
    />
  );
};

const WebMonitorLogoBrand = ({
  size = 36,
  textSize = '1.25rem',
  primaryColor = '#10b981',
  secondaryColor = '#059669',
  textColor = '#334155',
  showPulse = false,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        ...props.sx,
      }}
    >
      <WebMonitorLogo size={size} showPulse={showPulse} />
      <Box
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: textSize,
          color: textColor,
          letterSpacing: '-0.5px',
          fontFamily: '"Source Serif Pro", "Noto Serif SC", Georgia, serif',
        }}
      >
        WebMonitor
      </Box>
    </Box>
  );
};

export { WebMonitorLogo, WebMonitorLogoIcon, WebMonitorLogoBrand };
export default WebMonitorLogo;
