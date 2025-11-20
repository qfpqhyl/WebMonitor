import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as TestIcon,
  Info as InfoIcon,
  Mail as MailIcon,
  Security as SecurityIcon,
  CheckCircle as SuccessIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const EmailConfig = () => {
    const [openDialog, setOpenDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    smtp_server: '',
    smtp_port: '465',
    smtp_user: '',
    smtp_password: '',
    receiver_email: '',
    is_ssl: true,
  });

  const queryClient = useQueryClient();

  // 获取邮件配置列表
  const { data: emailConfigs = [] } = useQuery(
    'emailConfigs',
    async () => {
      const response = await axios.get('/api/email-configs');
      return response.data;
    }
  );

  // 创建邮件配置
  const createConfigMutation = useMutation(
    async (configData) => {
      const response = await axios.post('/api/email-configs', configData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('emailConfigs');
        setOpenDialog(false);
        resetForm();
      },
    }
  );

  // 更新邮件配置
  const updateConfigMutation = useMutation(
    async ({ id, ...configData }) => {
      const response = await axios.put(`/api/email-configs/${id}`, configData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('emailConfigs');
        setOpenDialog(false);
        resetForm();
      },
    }
  );

  // 删除邮件配置
  const deleteConfigMutation = useMutation(
    async (id) => {
      await axios.delete(`/api/email-configs/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('emailConfigs');
      },
    }
  );

  // 测试邮件配置
  const testConfigMutation = useMutation(
    async (configId) => {
      const response = await axios.post(`/api/email-configs/${configId}/test`);
      return response.data;
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      smtp_server: '',
      smtp_port: '465',
      smtp_user: '',
      smtp_password: '',
      receiver_email: '',
      is_ssl: true,
    });
    setEditingConfig(null);
  };

  const handleOpenDialog = (config = null) => {
    if (config) {
      setEditingConfig(config);
      setFormData({
        name: config.name,
        smtp_server: config.smtp_server,
        smtp_port: config.smtp_port,
        smtp_user: config.smtp_user,
        smtp_password: config.smtp_password,
        receiver_email: config.receiver_email,
        is_ssl: config.is_ssl,
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (editingConfig) {
      updateConfigMutation.mutate({ id: editingConfig.id, ...formData });
    } else {
      createConfigMutation.mutate(formData);
    }
  };

  const handleTestConfig = (configId) => {
    testConfigMutation.mutate(configId);
  };

  
  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 1,
            }}
          >
            系统设置
          </Typography>
          <Typography variant="body1" color="text.secondary">
            配置邮件通知和系统参数
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          添加邮件配置
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <MailIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {emailConfigs.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    邮件配置
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <SuccessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {emailConfigs.filter(c => c.is_active).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    活跃配置
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(34, 211, 238, 0.1)',
                    color: '#22d3ee',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    SSL/TLS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    安全连接
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'rgba(167, 139, 250, 0.1)',
                    color: '#a78bfa',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <SettingsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    已配置
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    系统设置
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Email Configurations */}
      <Paper
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            SMTP邮件配置
          </Typography>
        </Box>

        <Box sx={{ p: 3, backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 2, color: '#2563eb' }} />
            <Typography variant="body2">
              配置SMTP邮件服务器，系统将在监控到内容变化时发送通知邮件。支持多个邮件配置，在创建监控任务时可以选择使用哪个配置。
            </Typography>
          </Box>
        </Box>

        {emailConfigs.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
              }}
            >
              <MailIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              暂无邮件配置
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              添加第一个邮件配置开始使用通知功能
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              创建第一个配置
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>配置详情</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>发送邮箱</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>接收邮箱</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2, textAlign: 'center' }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailConfigs.map((config) => (
                  <TableRow
                    key={config.id}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.03)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                            fontSize: '1rem',
                          }}
                        >
                          {config.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {config.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {config.smtp_server}:{config.smtp_port} {config.is_ssl ? 'SSL' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {config.smtp_user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            SMTP发送账户
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {config.receiver_email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            通知接收账户
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="测试连接">
                          <IconButton
                            size="small"
                            onClick={() => handleTestConfig(config.id)}
                            disabled={testConfigMutation.isLoading}
                            sx={{
                              color: '#2563eb',
                              '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.1)' },
                            }}
                          >
                            <TestIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑配置">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(config)}
                            sx={{
                              color: '#10b981',
                              '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除配置">
                          <IconButton
                            size="small"
                            onClick={() => deleteConfigMutation.mutate(config.id)}
                            disabled={deleteConfigMutation.isLoading}
                            sx={{
                              color: '#ef4444',
                              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {(createConfigMutation.error || updateConfigMutation.error || deleteConfigMutation.error) && (
          <Alert
            severity="error"
            sx={{ m: 3, borderRadius: 2 }}
            variant="filled"
          >
            操作失败: {(createConfigMutation.error || updateConfigMutation.error || deleteConfigMutation.error).message}
          </Alert>
        )}

        {testConfigMutation.data && (
          <Alert
            severity={testConfigMutation.data.success ? 'success' : 'error'}
            sx={{ m: 3, borderRadius: 2 }}
            variant="filled"
          >
            {testConfigMutation.data.message || testConfigMutation.data.error}
          </Alert>
        )}
      </Paper>

      {/* Enhanced Email Configuration Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            border: '1px solid rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
            color: 'white',
            py: 3,
            '& .MuiTypography-root': {
              fontWeight: 700,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              {editingConfig ? <EditIcon /> : <AddIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6" component="span">
                {editingConfig ? '编辑邮件配置' : '创建邮件配置'}
              </Typography>
              <Typography variant="body2" component="div" sx={{ opacity: 0.9 }}>
                配置SMTP邮件服务器发送通知
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="配置名称"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SMTP服务器"
                  fullWidth
                  value={formData.smtp_server}
                  onChange={(e) => setFormData({ ...formData, smtp_server: e.target.value })}
                  required
                  placeholder="smtp.example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SMTP端口"
                  fullWidth
                  type="number"
                  value={formData.smtp_port}
                  onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) || '' })}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="发件人邮箱"
                  fullWidth
                  type="email"
                  value={formData.smtp_user}
                  onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="SMTP密码"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={formData.smtp_password}
                  onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
                  required
                  helperText="建议使用应用专用密码以提高安全性"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="接收者邮箱"
                  fullWidth
                  type="email"
                  value={formData.receiver_email}
                  onChange={(e) => setFormData({ ...formData, receiver_email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(37, 99, 235, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
                  <Switch
                    checked={formData.is_ssl}
                    onChange={(e) => setFormData({ ...formData, is_ssl: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-thumb': {
                        backgroundColor: formData.is_ssl ? '#2563eb' : 'default',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: formData.is_ssl ? 'rgba(37, 99, 235, 0.5)' : 'default',
                      },
                    }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      使用SSL加密
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      启用SSL/TLS加密连接确保邮件传输安全
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                px: 3,
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createConfigMutation.isLoading || updateConfigMutation.isLoading}
              sx={{
                background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                },
              }}
            >
              {editingConfig ? '更新配置' : '创建配置'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Footer GitHub Link */}
      <Box sx={{
        mt: 4,
        p: 3,
        textAlign: 'center',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          项目开源，欢迎贡献代码
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CodeIcon />}
          href="https://github.com/qfpqhyl"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderColor: 'rgba(37, 99, 235, 0.5)',
            color: '#2563eb',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
            },
          }}
        >
          访问 GitHub 仓库
        </Button>
      </Box>
    </Box>
  );
};

export default EmailConfig;
