import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  Avatar,
  Grid,
  alpha,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material';
import {
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Monitor as MonitorIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // 如果已经登录，重定向到dashboard或之前要访问的页面
  React.useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 使用表单数据格式进行登录
      const formFormData = new FormData();
      formFormData.append('username', formData.username);
      formFormData.append('password', formData.password);

      const response = await axios.post('/api/auth/login', formFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { access_token, user } = response.data;

      // 使用AuthContext的login方法
      login(user, access_token);

      // 获取登录前要访问的页面，默认跳转到dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        '登录失败，请检查用户名和密码'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 25% 25%, ${alpha('#10b981', 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, ${alpha('#2563eb', 0.1)} 0%, transparent 50%)`,
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left side - Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pr: { md: 4 } }}>
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    color: '#10b981',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>

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
                欢迎回来
              </Typography>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.1,
                }}
              >
                登录到
                <Box component="br" />
                <Typography component="span" sx={{ color: '#10b981' }}>
                  WebMonitor
                </Typography>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  lineHeight: 1.6,
                }}
              >
                继续监控您关心的网页内容，获取实时变化通知
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', mr: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Box
                      key={star}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        mr: 0.5,
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  企业级网页监控解决方案
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, md: 4 },
                backdropFilter: 'blur(20px)',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Logo */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                  sx={{
                    m: '0 auto',
                    background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                    width: 64,
                    height: 64,
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <MonitorIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography
                  component="h2"
                  variant="h4"
                  sx={{
                    mt: 2,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1a1a1a, #10b981)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  用户登录
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  请输入您的账户信息
                </Typography>
              </Box>

              {error && (
                <Alert
                  severity="error"
                  sx={{ width: '100%', mb: 3, borderRadius: 2 }}
                  variant="filled"
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="用户名"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: 2,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="密码"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    mt: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: 2,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          disabled={loading}
                          sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  size="large"
                  sx={{
                    mt: 4,
                    mb: 2,
                    py: 2,
                    background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)',
                    },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          mr: 2,
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid #fff',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      登录中...
                    </Box>
                  ) : (
                    '登录'
                  )}
                </Button>
              </Box>

              <Box sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  还没有账户？
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/register')}
                    sx={{
                      ml: 0.5,
                      color: '#10b981',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    立即注册
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  基于 Selenium 的专业网页监控解决方案
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default Login;