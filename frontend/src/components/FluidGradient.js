import React from 'react';
import { Box } from '@mui/material';

const FluidGradient = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        background: '#0F172A',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle at center, rgba(129, 140, 248, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'float1 20s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(circle at center, rgba(52, 211, 153, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float2 25s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float3 15s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '30%',
          height: '30%',
          background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float4 18s ease-in-out infinite reverse',
        }}
      />

      <style jsx>{`
        @keyframes float1 {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(-20px, 20px) scale(1.05);
          }
          66% {
            transform: translate(40px, -10px) scale(0.95);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(20px, 30px) scale(1.08);
          }
          66% {
            transform: translate(-30px, -20px) scale(0.92);
          }
        }

        @keyframes float4 {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(-25px, -15px) scale(1.03);
          }
          66% {
            transform: translate(15px, 25px) scale(0.97);
          }
        }
      `}</style>
    </Box>
  );
};

export default FluidGradient;