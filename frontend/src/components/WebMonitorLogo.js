/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';

/**
 * WebMonitor Logo Component
 * A modern, distinctive logo featuring a stylized eye within a radar/pulse design
 * representing web monitoring and real-time detection.
 */
const WebMonitorLogo = ({
  size = 40,
  primaryColor = '#10b981',
  secondaryColor = '#059669',
  showPulse = false,
  ...props
}) => {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        position: 'relative',
        ...props.sx,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Outer radar ring with pulse animation */}
        {showPulse && (
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="url(#pulseGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="18;22;18"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.2;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Main circular frame */}
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Radar sweep lines */}
        <path
          d="M24 4 L24 12"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M24 36 L24 44"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M4 24 L12 24"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M36 24 L44 24"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Inner circle - detection zone */}
        <circle
          cx="24"
          cy="24"
          r="12"
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />

        {/* Central eye/focus point - stylized "W" shape */}
        <path
          d="M16 20 L20 28 L24 22 L28 28 L32 20"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Detection dot with pulse */}
        <circle
          cx="24"
          cy="24"
          r="3"
          fill="url(#logoGradient)"
        >
          {showPulse && (
            <animate
              attributeName="r"
              values="2.5;3.5;2.5"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </svg>
    </Box>
  );
};

/**
 * WebMonitor Logo Icon - Simplified version for smaller sizes
 * Used in navigation, avatars, and compact spaces
 */
const WebMonitorLogoIcon = ({
  size = 24,
  color = '#ffffff',
  ...props
}) => {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        ...props.sx,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified W with radar accent */}
        <path
          d="M4 8 L8 16 L12 10 L16 16 L20 8"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Bottom arc representing monitoring/scanning */}
        <path
          d="M6 18 Q12 21 18 18"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </Box>
  );
};

/**
 * WebMonitor Logo with Text
 * Full branding component with logo and text
 */
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
      <WebMonitorLogo
        size={size}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        showPulse={showPulse}
      />
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
