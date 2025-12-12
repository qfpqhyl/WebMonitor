import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Avatar,
  Card,
  CardContent,
  Stack,
  alpha,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Monitor as MonitorIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  IntegrationInstructions as IntegrationIcon,
  AutoAwesome as SparkleIcon,
  RocketLaunch as RocketIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
import FluidGradient from '../components/FluidGradient';

// Custom GitHub Icon Component
const GitHubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="32"
    height="32"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const ref = useRef(null);
  const refFeatures = useRef(null);
  const refAdvantages = useRef(null);
  const refCTA = useRef(null);
  const featuresInView = useInView(refFeatures, { once: true, margin: "-100px" });
  const advantagesInView = useInView(refAdvantages, { once: true, margin: "-100px" });
  const ctaInView = useInView(refCTA, { once: true, margin: "-100px" });

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <MonitorIcon sx={{ fontSize: 32 }} />,
      title: '实时监控',
      description: '24/7不间断监控网页内容变化\n支持JavaScript渲染和动态内容抓取',
      color: '#818CF8',
      gradient: 'linear-gradient(45deg, #818CF8, #6366F1)',
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 32 }} />,
      title: '即时通知',
      description: '邮件、webhook等多种通知方式\n确保您第一时间获取重要变化',
      color: '#34D399',
      gradient: 'linear-gradient(45deg, #34D399, #10B981)',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      title: '安全可靠',
      description: '企业级安全保障，数据加密存储\n完善的权限管理和访问控制',
      color: '#F59E0B',
      gradient: 'linear-gradient(45deg, #F59E0B, #D97706)',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      title: '高性能',
      description: '优化的监控引擎，支持大规模并发监控\n响应速度毫秒级',
      color: '#EC4899',
      gradient: 'linear-gradient(45deg, #EC4899, #DB2777)',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 32 }} />,
      title: '智能分析',
      description: '基于XPath的精准定位，智能内容比对\n有效减少误报',
      color: '#14B8A6',
      gradient: 'linear-gradient(45deg, #14B8A6, #0D9488)',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 32 }} />,
      title: '灵活调度',
      description: '自定义监控间隔（10秒-24小时）\n支持不同时段差异化配置',
      color: '#A855F7',
      gradient: 'linear-gradient(45deg, #A855F7, #9333EA)',
    },
  ];

  const advantages = [
    {
      icon: <CheckCircleIcon />,
      title: '零配置启动',
      description: '无需安装软件\n只需注册账号即可开始使用',
      color: '#22C55E',
    },
    {
      icon: <TrendingUpIcon />,
      title: '可扩展架构',
      description: '支持从小型团队\n到企业级的大规模监控需求',
      color: '#3B82F6',
    },
    {
      icon: <IntegrationIcon />,
      title: 'API集成',
      description: '提供完整的RESTful API\n支持第三方系统集成',
      color: '#F97316',
    },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  // 3D transform based on mouse position
  const getTransform = (x, y) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return {};
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;
    return { rotateX, rotateY };
  };

  return (
    <Box sx={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#0F172A',
      minHeight: '100vh'
    }}>
      {/* Particle Background */}
      <ParticleBackground />

      {/* Fluid Gradient Background */}
      <FluidGradient />

      {/* Navigation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}`,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                letterSpacing: '-0.5px',
              }}
            >
              <MonitorIcon sx={{ color: '#818CF8' }} />
              WebMonitor
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  color: '#FFFFFF',
                  borderColor: alpha('#FFFFFF', 0.2),
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    borderColor: alpha('#FFFFFF', 0.4),
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                登录
              </Button>
              <Button
                variant="contained"
                onClick={handleRegister}
                sx={{
                  background: 'linear-gradient(45deg, #818CF8, #6366F1)',
                  color: '#FFFFFF',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6366F1, #4F46E5)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(129, 140, 248, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                注册
              </Button>
              <Tooltip title="qfpqhyl的GitHub" arrow>
                <IconButton
                  href="https://github.com/qfpqhyl"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#FFFFFF',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#FFFFFF', 0.2)}`,
                    width: 44,
                    height: 44,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderColor: alpha('#FFFFFF', 0.4),
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Container>
      </motion.div>

      {/* Hero Section */}
      <Box
        ref={ref}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          py: { xs: 15, md: 0 },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 6 } }}>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            <Grid item xs={12} lg={5}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ maxWidth: 600 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SparkleIcon sx={{ color: '#FBBF24', mr: 1, fontSize: 24 }} />
                    <Typography
                      variant="overline"
                      component="div"
                      sx={{
                        color: '#FBBF24',
                        fontWeight: 'bold',
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                      }}
                    >
                      新一代智能监控平台
                    </Typography>
                  </Box>

                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '4rem' },
                      lineHeight: 1.1,
                      background: 'linear-gradient(45deg, #FFFFFF 30%, #818CF8 60%, #34D399 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    实时监控
                    <br />
                    每一次变化
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 5,
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      lineHeight: 1.7,
                    }}
                  >
                    基于 Selenium 的强大引擎，精准捕捉动态内容变化
                    <br />
                    为您提供最可靠的网页监控解决方案
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleRegister}
                        sx={{
                          background: 'linear-gradient(45deg, #818CF8, #6366F1)',
                          color: '#FFFFFF',
                          py: 2.5,
                          px: 5,
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          borderRadius: '16px',
                          boxShadow: '0 10px 30px rgba(129, 140, 248, 0.3)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: -100,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            transition: 'left 0.6s',
                          },
                          '&:hover:before': {
                            left: '100%',
                          },
                        }}
                        endIcon={<RocketIcon />}
                      >
                        免费开始使用
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleLogin}
                        sx={{
                          borderColor: alpha('#FFFFFF', 0.3),
                          color: '#FFFFFF',
                          py: 2.5,
                          px: 5,
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          borderRadius: '16px',
                          backdropFilter: 'blur(10px)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: alpha('#FFFFFF', 0.5),
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        立即登录
                      </Button>
                    </motion.div>
                  </Stack>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} lg={7}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{
                  transform: `perspective(1000px) rotateY(${getTransform(mousePosition.x, mousePosition.y).rotateY}deg) rotateX(${getTransform(mousePosition.x, mousePosition.y).rotateX}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.2s ease-out',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 600,
                  }}
                >
                  {/* Animated Dashboard Mockup */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotateZ: [-1, 1, -1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Paper
                      sx={{
                        width: '100%',
                        maxWidth: 800,
                        p: 4,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {/* Browser Window Header */}
                      <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 3,
                        alignItems: 'center'
                      }}>
                        {[1, 2, 3].map((item) => (
                          <motion.div
                            key={item}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: item * 0.3,
                            }}
                          >
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: item === 1 ? '#818CF8' : item === 2 ? '#34D399' : '#F59E0B',
                              }}
                            />
                          </motion.div>
                        ))}
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            ml: 2,
                            fontSize: '0.8rem'
                          }}
                        >
                          WebMonitor Dashboard
                        </Typography>
                      </Box>

                      {/* URL Bar */}
                      <Box sx={{
                        mb: 3,
                        p: 1.5,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <MonitorIcon sx={{ color: '#818CF8', mr: 2, fontSize: 18 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem'
                          }}
                        >
                          https://example.com/monitoring-target
                        </Typography>
                      </Box>

                      {/* Monitoring Status Area */}
                      <Box sx={{
                        height: 300,
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 2,
                        mb: 3,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Status Messages */}
                        <Box sx={{ p: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#FFFFFF',
                              mb: 2
                            }}
                          >
                            监控状态
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {[
                              { text: '正在监控 https://example.com', status: 'active' },
                              { text: '上次检查: 2分钟前', status: 'info' },
                              { text: '状态: 正常运行中', status: 'success' }
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      background: item.status === 'active' ? '#818CF8' :
                                                 item.status === 'success' ? '#34D399' : '#FBBF24'
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontSize: '0.85rem'
                                    }}
                                  >
                                    {item.text}
                                  </Typography>
                                </Box>
                              </motion.div>
                            ))}
                          </Box>
                        </Box>

                        {/* Loading Animation */}
                        <motion.div
                          animate={{ opacity: [0, 1, 0], x: [-100, 100, -100] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%'
                          }}
                        >
                          <Box
                            sx={{
                              height: '2px',
                              background: 'linear-gradient(90deg, transparent, #818CF8, transparent)',
                              width: '50%',
                            }}
                          />
                        </motion.div>
                      </Box>

                      {/* Action Buttons */}
                      <Grid container spacing={2}>
                        {[
                          { label: '添加新任务', color: '#818CF8' },
                          { label: '查看日志', color: '#34D399' },
                          { label: '监控历史', color: '#F59E0B' },
                          { label: '系统设置', color: '#EC4899' }
                        ].map((item, index) => (
                          <Grid item xs={6} key={index}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              style={{ originX: 0.5, originY: 0.5 }}
                            >
                              <Paper
                                sx={{
                                  p: 2,
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: `1px solid ${alpha(item.color, 0.3)}`,
                                  borderRadius: 2,
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${alpha(item.color, 0.5)}`,
                                  }
                                }}
                              >
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      background: item.color
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '0.85rem'
                                    }}
                                  >
                                    {item.label}
                                  </Typography>
                                </Box>
                              </Paper>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        ref={refFeatures}
        sx={{
          py: { xs: 10, md: 15 },
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(30, 41, 59, 0.3) 100%)',
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
              <Typography
                variant="overline"
                component="div"
                sx={{
                  color: '#A78BFA',
                  fontWeight: 'bold',
                  mb: 2,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                核心功能
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  color: '#FFFFFF',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3.5rem' },
                }}
              >
                专业级监控能力
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                基于 Selenium WebDriver 的强大引擎
                为您提供精准可靠的网页内容监控服务
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{
                    duration: 0.6,
                    delay: featuresInView ? index * 0.1 : 0,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.03, y: -10 }}
                  style={{ originX: 0.5, originY: 0.5 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'left',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: `1px solid ${alpha(feature.color, 0.2)}`,
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: feature.gradient,
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${alpha(feature.color, 0.4)}`,
                        boxShadow: `0 20px 40px ${alpha(feature.color, 0.15)}`,
                        transform: 'translateY(-10px) scale(1.03)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            background: feature.gradient,
                            width: 60,
                            height: 60,
                            mr: 3,
                            boxShadow: `0 8px 25px ${alpha(feature.color, 0.3)}`,
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{ fontWeight: 700, color: '#FFFFFF' }}
                          >
                            {feature.title}
                          </Typography>
                          <Box
                            sx={{
                              width: '60%',
                              height: 3,
                              background: feature.gradient,
                              borderRadius: 2,
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          lineHeight: 1.7,
                          fontSize: '1rem',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Advantages Section */}
      <Box
        ref={refAdvantages}
        sx={{
          py: { xs: 10, md: 15 },
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%)',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={advantagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
              <Typography
                variant="overline"
                component="div"
                sx={{
                  color: '#22D3EE',
                  fontWeight: 'bold',
                  mb: 2,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                为什么选择 WebMonitor
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  color: '#FFFFFF',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                技术优势明显
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4} alignItems="stretch">
            {advantages.map((advantage, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={advantagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{
                    duration: 0.6,
                    delay: advantagesInView ? index * 0.1 : 0,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.05 }}
                  style={{ height: '100%' }}
                >
                  <Paper
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.02)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(advantage.color, 0.2)}`,
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${alpha(advantage.color, 0.4)}`,
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        background: advantage.color,
                        width: 70,
                        height: 70,
                        mx: 'auto',
                        mb: 3,
                        boxShadow: `0 10px 30px ${alpha(advantage.color, 0.3)}`,
                      }}
                    >
                      {advantage.icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2 }}
                    >
                      {advantage.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {advantage.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        ref={refCTA}
        sx={{
          py: { xs: 12, md: 20 },
          position: 'relative',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: '#22D3EE',
                fontWeight: 'bold',
                mb: 2,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              准备开始了吗
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                color: '#FFFFFF',
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', md: '3.5rem' },
              }}
            >
              立即开始监控您关心的网页内容
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 6,
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              注册账号，立即体验专业的网页监控服务
              <br />
              享受实时内容变化通知
            </Typography>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-block' }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleRegister}
                sx={{
                  background: 'linear-gradient(45deg, #818CF8, #6366F1, #34D399)',
                  backgroundSize: '200% 200%',
                  color: '#FFFFFF',
                  py: 3,
                  px: 8,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  boxShadow: '0 15px 40px rgba(129, 140, 248, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'gradientShift 3s ease infinite',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 20px 50px rgba(129, 140, 248, 0.5)',
                  },
                  '@keyframes gradientShift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                }}
                endIcon={<RocketIcon />}
              >
                免费开始使用
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          color: '#FFFFFF',
          textAlign: 'center',
          borderTop: `1px solid ${alpha('#FFFFFF', 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <MonitorIcon sx={{ mr: 1, color: '#818CF8' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#818CF8' }}>
              WebMonitor
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
            © 2024 WebMonitor. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            基于 Selenium 的专业网页内容
              <br />
              监控解决方案
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;