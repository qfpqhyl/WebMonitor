import { useRef } from 'react';
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
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  Monitor as MonitorIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { WebMonitorLogo, WebMonitorLogoIcon } from '../components/WebMonitorLogo';

// Custom GitHub Icon Component
const GitHubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const HomePage = () => {
  const navigate = useNavigate();

  const refHero = useRef(null);
  const refFeatures = useRef(null);
  const refAdvantages = useRef(null);
  const refCTA = useRef(null);
  const heroInView = useInView(refHero, { once: true, margin: "-100px" });
  const featuresInView = useInView(refFeatures, { once: true, margin: "-100px" });
  const advantagesInView = useInView(refAdvantages, { once: true, margin: "-100px" });
  const ctaInView = useInView(refCTA, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <MonitorIcon sx={{ fontSize: 28 }} />,
      title: '实时监控',
      description: '24/7不间断监控网页内容变化，支持JavaScript渲染和动态内容抓取',
      color: '#10b981',
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 28 }} />,
      title: '即时通知',
      description: '邮件、webhook等多种通知方式，确保您第一时间获取重要变化',
      color: '#2563eb',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 28 }} />,
      title: '安全可靠',
      description: '企业级安全保障，数据加密存储，完善的权限管理和访问控制',
      color: '#f59e0b',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 28 }} />,
      title: '高性能',
      description: '优化的监控引擎，支持大规模并发监控，响应速度毫秒级',
      color: '#ec4899',
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 28 }} />,
      title: '智能分析',
      description: '基于XPath的精准定位，智能内容比对，有效减少误报',
      color: '#8b5cf6',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 28 }} />,
      title: '灵活调度',
      description: '自定义监控间隔（10秒-24小时），支持不同时段差异化配置',
      color: '#06b6d4',
    },
  ];

  const advantages = [
    {
      icon: <CheckCircleIcon />,
      title: '零配置启动',
      description: '无需安装软件，只需注册账号即可开始使用',
      color: '#10b981',
    },
    {
      icon: <TrendingUpIcon />,
      title: '可扩展架构',
      description: '支持从小型团队到企业级的大规模监控需求',
      color: '#2563eb',
    },
    {
      icon: <IntegrationIcon />,
      title: 'API集成',
      description: '提供完整的RESTful API，支持第三方系统集成',
      color: '#f59e0b',
    },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Box sx={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Subtle Background Pattern */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, ${alpha('#10b981', 0.03)} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${alpha('#2563eb', 0.03)} 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${alpha('#f8fafc', 0.8)} 0%, transparent 100%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Grid Pattern Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${alpha('#e2e8f0', 0.3)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha('#e2e8f0', 0.3)} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

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
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <WebMonitorLogo size={40} showPulse />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: '#334155',
                  letterSpacing: '-0.5px',
                }}
              >
                WebMonitor
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="text"
                onClick={() => navigate('/docs')}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#10b981',
                    backgroundColor: 'transparent',
                  },
                  transition: 'color 0.2s ease',
                }}
              >
                文档
              </Button>
              <Button
                variant="text"
                onClick={handleLogin}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#10b981',
                    backgroundColor: 'transparent',
                  },
                  transition: 'color 0.2s ease',
                }}
              >
                登录
              </Button>
              <Button
                variant="contained"
                onClick={handleRegister}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                免费注册
              </Button>
              <Tooltip title="GitHub" arrow>
                <IconButton
                  href="https://github.com/qfpqhyl"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#64748b',
                    '&:hover': {
                      color: '#10b981',
                      backgroundColor: alpha('#10b981', 0.04),
                    },
                    transition: 'all 0.2s ease',
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
        ref={refHero}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          pt: { xs: 12, md: 0 },
          pb: { xs: 8, md: 0 },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 6 } }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ maxWidth: 580 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 2,
                        py: 0.75,
                        borderRadius: 10,
                        backgroundColor: alpha('#10b981', 0.08),
                        border: `1px solid ${alpha('#10b981', 0.15)}`,
                      }}
                    >
                      <SparkleIcon sx={{ color: '#10b981', mr: 1, fontSize: 18 }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#10b981',
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          textTransform: 'uppercase',
                        }}
                      >
                        新一代智能监控平台
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: '2.75rem', md: '4rem', lg: '4.5rem' },
                      lineHeight: 1.1,
                      color: '#334155',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    实时监控
                    <br />
                    <Box
                      component="span"
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #2563eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      每一次变化
                    </Box>
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: '#64748b',
                      mb: 5,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      lineHeight: 1.7,
                      fontWeight: 400,
                    }}
                  >
                    基于 Selenium 的强大引擎，精准捕捉动态内容变化，
                    为您提供最可靠的网页监控解决方案
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleRegister}
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#FFFFFF',
                          py: 2,
                          px: 4,
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)',
                          '&:hover': {
                            boxShadow: '0 12px 40px rgba(16, 185, 129, 0.35)',
                          },
                        }}
                        endIcon={<RocketIcon />}
                      >
                        免费开始使用
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleLogin}
                        sx={{
                          borderColor: '#e2e8f0',
                          color: '#475569',
                          py: 2,
                          px: 4,
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                          '&:hover': {
                            borderColor: '#10b981',
                            color: '#10b981',
                            backgroundColor: alpha('#10b981', 0.04),
                          },
                        }}
                        startIcon={<PlayArrowIcon />}
                      >
                        立即登录
                      </Button>
                    </motion.div>
                  </Stack>

                  {/* Trust Indicators */}
                  <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155' }}>
                        24/7
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        全天候监控
                      </Typography>
                    </Box>
                    <Box sx={{ width: 1, height: 30, backgroundColor: '#e2e8f0' }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155' }}>
                        99.9%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        服务可用性
                      </Typography>
                    </Box>
                    <Box sx={{ width: 1, height: 30, backgroundColor: '#e2e8f0' }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155' }}>
                        &lt;1s
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        响应延迟
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* Dashboard Preview Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      width: '100%',
                      maxWidth: 560,
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    {/* Browser Header */}
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {['#ff5f57', '#febc2e', '#28c840'].map((color, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: color,
                            }}
                          />
                        ))}
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          mx: 2,
                          py: 0.75,
                          px: 2,
                          borderRadius: 1.5,
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <MonitorIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          webmonitor.app/dashboard
                        </Typography>
                      </Box>
                    </Box>

                    {/* Dashboard Content Preview */}
                    <Box sx={{ p: 3 }}>
                      {/* Stats Row */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        {[
                          { label: '活跃任务', value: '12', color: '#10b981' },
                          { label: '今日变化', value: '5', color: '#2563eb' },
                          { label: '成功率', value: '99%', color: '#f59e0b' },
                        ].map((stat, i) => (
                          <Grid item xs={4} key={i}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                              transition={{ delay: 0.6 + i * 0.1 }}
                            >
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  backgroundColor: alpha(stat.color, 0.08),
                                  textAlign: 'center',
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  sx={{ fontWeight: 700, color: stat.color }}
                                >
                                  {stat.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                  {stat.label}
                                </Typography>
                              </Box>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Activity List */}
                      <Box sx={{ backgroundColor: '#f8fafc', borderRadius: 2, p: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#475569', mb: 2 }}>
                          最近监控活动
                        </Typography>
                        {[
                          { url: 'example.com/products', status: '检测到变化', statusColor: '#f59e0b' },
                          { url: 'shop.example.com', status: '正常', statusColor: '#10b981' },
                          { url: 'news.example.com', status: '正常', statusColor: '#10b981' },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                py: 1.5,
                                borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: item.statusColor,
                                  }}
                                />
                                <Typography variant="body2" sx={{ color: '#475569' }}>
                                  {item.url}
                                </Typography>
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{ color: item.statusColor, fontWeight: 500 }}
                              >
                                {item.status}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </Paper>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Avatar sx={{ width: 36, height: 36, backgroundColor: alpha('#10b981', 0.1) }}>
                        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          内容变化检测
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 600 }}>
                          已通知
                        </Typography>
                      </Box>
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
          backgroundColor: '#f8fafc',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
              <Typography
                variant="overline"
                component="div"
                sx={{
                  color: '#10b981',
                  fontWeight: 600,
                  mb: 2,
                  letterSpacing: 2,
                }}
              >
                核心功能
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  color: '#334155',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                专业级监控能力
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#64748b',
                  maxWidth: 500,
                  mx: 'auto',
                  lineHeight: 1.7,
                }}
              >
                基于 Selenium WebDriver 的强大引擎，为您提供精准可靠的网页内容监控服务
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.5,
                    delay: featuresInView ? index * 0.1 : 0,
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 1,
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      borderRadius: 3,
                      backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                        borderColor: alpha(feature.color, 0.3),
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          mb: 3,
                          backgroundColor: alpha(feature.color, 0.1),
                          color: feature.color,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 700, color: '#334155', mb: 1.5 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          lineHeight: 1.7,
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
          backgroundColor: '#ffffff',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={advantagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
              <Typography
                variant="overline"
                component="div"
                sx={{
                  color: '#2563eb',
                  fontWeight: 600,
                  mb: 2,
                  letterSpacing: 2,
                }}
              >
                为什么选择我们
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  color: '#334155',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  letterSpacing: '-0.02em',
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={advantagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.5,
                    delay: advantagesInView ? index * 0.1 : 0,
                  }}
                  style={{ height: '100%' }}
                >
                  <Paper
                    sx={{
                      textAlign: 'center',
                      p: 5,
                      height: '100%',
                      backgroundColor: '#f8fafc',
                      border: '1px solid rgba(0, 0, 0, 0.04)',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#ffffff',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: alpha(advantage.color, 0.1),
                        color: advantage.color,
                        width: 72,
                        height: 72,
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      {advantage.icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: 700, color: '#334155', mb: 2 }}
                    >
                      {advantage.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        lineHeight: 1.7,
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
          py: { xs: 12, md: 16 },
          position: 'relative',
          background: '#f8fafc',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, ${alpha('#10b981', 0.08)} 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, ${alpha('#2563eb', 0.08)} 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 5, md: 8 },
                borderRadius: 4,
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.06)',
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  color: '#334155',
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                立即开始监控您关心的网页内容
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#64748b',
                  mb: 5,
                  maxWidth: 450,
                  mx: 'auto',
                  lineHeight: 1.7,
                }}
              >
                注册账号，立即体验专业的网页监控服务，享受实时内容变化通知
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleRegister}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      py: 2,
                      px: 5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(16, 185, 129, 0.35)',
                      },
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    免费开始使用
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleLogin}
                    sx={{
                      borderColor: '#e2e8f0',
                      color: '#475569',
                      py: 2,
                      px: 5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        borderColor: '#10b981',
                        color: '#10b981',
                        backgroundColor: alpha('#10b981', 0.04),
                      },
                    }}
                  >
                    立即登录
                  </Button>
                </motion.div>
              </Stack>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          backgroundColor: '#ffffff',
          textAlign: 'center',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Box sx={{ mr: 1.5 }}>
              <WebMonitorLogo size={32} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
              WebMonitor
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
            © 2024 WebMonitor. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
            基于 Selenium 的专业网页内容监控解决方案
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
