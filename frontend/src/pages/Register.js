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
  Link,
  Grid,
  alpha,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 如果已经登录，重定向到dashboard
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    // 长度检查
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;

    // 包含数字
    if (/\d/.test(password)) strength += 25;

    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

    return Math.min(strength, 100);
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('请填写所有必填字段');
      return false;
    }

    if (formData.username.length < 3) {
      setError('用户名长度至少为3位');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }

    return true;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({
      ...formData,
      password: newPassword,
    });
    setPasswordStrength(calculatePasswordStrength(newPassword));
    setError('');
    setSuccess('');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'error';
    if (passwordStrength < 70) return 'warning';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return '弱';
    if (passwordStrength < 70) return '中等';
    return '强';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 使用JSON格式进行注册
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      await axios.post('/api/auth/register', registerData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccess('注册成功！正在跳转到登录页面...');

      // 2秒后跳转到登录页面
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        '注册失败，请稍后重试'
      );
    } finally {
      setLoading(false);
    }
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
          background: `radial-gradient(circle at 75% 25%, ${alpha('#2563eb', 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 25% 75%, ${alpha('#10b981', 0.1)} 0%, transparent 50%)`,
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
                    color: '#2563eb',
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
                  color: '#2563eb',
                  fontWeight: 'bold',
                  mb: 2,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                加入我们
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
                创建您的
                <Box component="br" />
                <Typography component="span" sx={{ color: '#2563eb' }}>
                  监控账户
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
                注册 WebMonitor，开始监控您关心的网页内容变化
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  注册后您将获得：
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#10b981', mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    实时网页内容监控
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#10b981', mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    邮件变化通知
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#10b981', mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    自定义监控频率
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ color: '#10b981', mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    基于Selenium的精准抓取
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right side - Register Form */}
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
                    background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                    width: 64,
                    height: 64,
                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography
                  component="h2"
                  variant="h4"
                  sx={{
                    mt: 2,
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1a1a1a, #2563eb)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  创建账户
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  填写以下信息完成注册
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

              {success && (
                <Alert
                  severity="success"
                  sx={{ width: '100%', mb: 3, borderRadius: 2 }}
                  variant="filled"
                >
                  {success}
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
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
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
                  id="email"
                  label="邮箱地址"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
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
                          onClick={() => setShowPassword(!showPassword)}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                        密码强度:
                      </Typography>
                      <Typography
                        variant="caption"
                        color={`${getPasswordStrengthColor()}.main`}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {getPasswordStrengthText()}
                      </Typography>
                    </Box>
                    <Box sx={{ height: 4, backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>
                      <Box
                        sx={{
                          height: '100%',
                          width: `${passwordStrength}%`,
                          backgroundColor: `${getPasswordStrengthColor()}.main`,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </Box>
                  </Box>
                )}

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="确认密码"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
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
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={loading}
                          sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                    background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
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
                      注册中...
                    </Box>
                  ) : (
                    '创建账户'
                  )}
                </Button>
              </Box>

              <Box sx={{ mt: 3, width: '100%', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  已有账户？
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{
                      ml: 0.5,
                      color: '#2563eb',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    立即登录
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  注册即表示您同意我们的服务条款和隐私政策
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

export default Register;