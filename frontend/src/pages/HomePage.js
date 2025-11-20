import React from 'react';
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
  Fade,
  Slide,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Monitor as MonitorIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  IntegrationInstructions as IntegrationIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import sampleProductImage from '../assets/images/sample-product.png';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MonitorIcon sx={{ fontSize: 40 }} />,
      title: '实时监控',
      description: '24/7不间断监控网页内容变化，支持JavaScript渲染和动态内容抓取',
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 40 }} />,
      title: '即时通知',
      description: '邮件、webhook等多种通知方式，确保您第一时间获取重要变化',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: '安全可靠',
      description: '企业级安全保障，数据加密存储，完善的权限管理和访问控制',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: '高性能',
      description: '优化的监控引擎，支持大规模并发监控，响应速度毫秒级',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      title: '智能分析',
      description: '基于XPath的精准定位，智能内容比对，有效减少误报',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      title: '灵活调度',
      description: '自定义监控间隔（10秒-24小时），支持不同时段差异化配置',
    },
  ];

  const advantages = [
    {
      icon: <CheckCircleIcon />,
      title: '零配置启动',
      description: '无需安装软件，只需注册账号即可开始使用',
    },
    {
      icon: <TrendingUpIcon />,
      title: '可扩展架构',
      description: '支持从小型团队到企业级的大规模监控需求',
    },
    {
      icon: <IntegrationIcon />,
      title: 'API集成',
      description: '提供完整的RESTful API，支持第三方系统集成',
    },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'transparent',
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
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <MonitorIcon />
              WebMonitor
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                登录
              </Button>
              <Button
                variant="contained"
                onClick={handleRegister}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                注册
              </Button>
              <Tooltip title="访问开发者的GitHub" arrow>
                <IconButton
                  href="https://github.com/qfpqhyl"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    width: 44,
                    height: 44,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <CodeIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 50%, ${alpha('#2563eb', 0.1)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 50%, ${alpha('#10b981', 0.1)} 0%, transparent 50%)`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M0 20h40v1H0z"/%3E%3Cpath d="M20 0v40h1V0z"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '40px 40px',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 6 } }}>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            <Grid item xs={12} lg={5}>
              <Fade in timeout={1000}>
                <Box sx={{ maxWidth: 600 }}>
                  <Typography
                    variant="overline"
                    component="div"
                    sx={{
                      color: '#10b981',
                      fontWeight: 'bold',
                      mb: 3,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    智能监控解决方案
                  </Typography>
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      mb: 4,
                      fontSize: { xs: '2.2rem', md: '3.5rem' },
                      lineHeight: 1.1,
                    }}
                  >
                    专注网页内容
                    <Box component="br" />
                    <Typography component="span" sx={{ color: '#10b981' }}>
                      变化监控
                    </Typography>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      mb: 5,
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      lineHeight: 1.7,
                    }}
                  >
                    基于 Selenium 的强大引擎，精准捕捉动态内容变化，
                    支持复杂的现代网页应用监控
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleRegister}
                      sx={{
                        background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                        color: 'white',
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 30px rgba(16, 185, 129, 0.4)',
                        },
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      免费开始使用
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleLogin}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      立即登录
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} lg={7}>
              <Slide direction="right" in timeout={1200}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 600,
                  }}
                >
                  {/* Product Preview Image */}
                  <Box
                    component="img"
                    src={sampleProductImage}
                    alt="WebMonitor 产品展示"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: 900,
                      maxHeight: 650,
                      borderRadius: 3,
                      filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.4))',
                      objectFit: 'contain',
                      transform: 'perspective(1000px) rotateY(-2deg)',
                      transition: 'transform 0.6s ease',
                      '&:hover': {
                        transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
                      },
                    }}
                  />

                    </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: '#10b981',
                fontWeight: 'bold',
                mb: 2,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              功能特性
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                color: '#1a1a1a',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              专业级监控能力
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              基于 Selenium WebDriver 的强大引擎，为您提供精准可靠的网页内容监控服务
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Slide in timeout={800 + index * 100} direction="up">
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'left',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 3,
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                            width: 60,
                            height: 60,
                            mr: 2,
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{ fontWeight: 700, color: '#1a1a1a' }}
                          >
                            {feature.title}
                          </Typography>
                          <Box
                            sx={{
                              width: 40,
                              height: 3,
                              background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                              borderRadius: 2,
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                          fontSize: '0.95rem',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Advantages Section */}
      <Box sx={{ py: 12, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: '#2563eb',
                fontWeight: 'bold',
                mb: 2,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              为什么选择我们
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                color: '#1a1a1a',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              技术优势明显
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            {advantages.map((advantage, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Slide in timeout={1000 + index * 200} direction="up">
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                        width: 70,
                        height: 70,
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.25)',
                      }}
                    >
                      {advantage.icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 700, color: '#1a1a1a', mb: 2 }}
                    >
                      {advantage.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {advantage.description}
                    </Typography>
                  </Box>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 16,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 30% 20%, ${alpha('#10b981', 0.1)} 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, ${alpha('#2563eb', 0.1)} 0%, transparent 50%)`,
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            component="div"
            sx={{
              color: '#10b981',
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
              color: 'white',
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            立即开始监控您关心的网页内容
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 6,
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            注册账号，立即体验专业的网页监控服务，享受实时内容变化通知
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleRegister}
            sx={{
              background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
              color: 'white',
              py: 3,
              px: 8,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 40px rgba(16, 185, 129, 0.5)',
              },
            }}
            endIcon={<ArrowForwardIcon />}
          >
            免费开始使用
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          backgroundColor: '#0f172a',
          color: 'white',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <MonitorIcon sx={{ mr: 1, color: '#10b981' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10b981' }}>
              WebMonitor
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
            © 2024 WebMonitor. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            基于 Selenium 的专业网页内容监控解决方案
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;