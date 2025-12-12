import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  alpha,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Subscriptions as SubscriptionsIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Settings as SettingsIcon,
  Monitor as MonitorIcon,
  Link as LinkIcon,
  } from '@mui/icons-material';
import axios from 'axios';

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [emailConfigs, setEmailConfigs] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    is_active: true,
    email_config_id: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // 获取订阅列表
  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('获取订阅列表失败:', error);
      setSnackbar({
        open: true,
        message: '获取订阅列表失败: ' + (error.response?.data?.detail || '未知错误'),
        severity: 'error',
      });
    }
  };

  // 获取邮箱配置列表
  const fetchEmailConfigs = async () => {
    try {
      const response = await axios.get('/api/email-configs');
      setEmailConfigs(response.data);
    } catch (error) {
      console.error('获取邮箱配置失败:', error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchEmailConfigs();
  }, []);

  // 打开编辑对话框
  const handleOpenEditDialog = (subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      is_active: subscription.is_active,
      email_config_id: subscription.email_config_id,
    });
    setEditDialogOpen(true);
  };

  // 关闭编辑对话框
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingSubscription(null);
    setFormData({
      is_active: true,
      email_config_id: null,
    });
  };

  // 更新订阅
  const handleUpdateSubscription = async () => {
    try {
      await axios.put(`/api/subscriptions/${editingSubscription.id}`, formData);

      setSnackbar({
        open: true,
        message: '订阅更新成功',
        severity: 'success',
      });

      handleCloseEditDialog();
      fetchSubscriptions();
    } catch (error) {
      console.error('更新订阅失败:', error);
      setSnackbar({
        open: true,
        message: '更新订阅失败: ' + (error.response?.data?.detail || '未知错误'),
        severity: 'error',
      });
    }
  };

  // 取消订阅
  const handleDeleteSubscription = async (subscriptionId) => {
    if (window.confirm('确定要取消这个订阅吗？')) {
      try {
        await axios.delete(`/api/subscriptions/${subscriptionId}`);

        setSnackbar({
          open: true,
          message: '订阅取消成功',
          severity: 'success',
        });

        fetchSubscriptions();
      } catch (error) {
        console.error('取消订阅失败:', error);
        setSnackbar({
          open: true,
          message: '取消订阅失败: ' + (error.response?.data?.detail || '未知错误'),
          severity: 'error',
        });
      }
    }
  };

  // 关闭提示
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
            我的订阅
          </Typography>
          <Typography variant="body1" color="text.secondary">
            管理您订阅的公开任务和通知设置
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1976d2 0%, rgba(25, 118, 210, 0.6) 100%)',
              },
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    color: '#1976d2',
                    width: 48,
                    height: 48,
                  }}
                >
                  <SubscriptionsIcon />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                  {subscriptions.length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  总订阅数
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #10b981 0%, rgba(16, 185, 129, 0.6) 100%)',
              },
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    width: 48,
                    height: 48,
                  }}
                >
                  <NotificationsActiveIcon />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                  {subscriptions.filter(sub => sub.is_active).length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  启用通知
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #ef4444 0%, rgba(239, 68, 68, 0.6) 100%)',
              },
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    width: 48,
                    height: 48,
                  }}
                >
                  <NotificationsOffIcon />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                  {subscriptions.filter(sub => !sub.is_active).length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  停用通知
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #a78bfa 0%, rgba(167, 139, 250, 0.6) 100%)',
              },
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(167, 139, 250, 0.1)',
                    color: '#a78bfa',
                    width: 48,
                    height: 48,
                  }}
                >
                  <MonitorIcon />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                  {emailConfigs.length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  邮箱配置
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 订阅管理说明卡片 */}
      <Card sx={{ mb: 4, backgroundColor: alpha('#1976d2', 0.04), border: `1px solid ${alpha('#1976d2', 0.12)}` }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <SettingsIcon sx={{ fontSize: 20, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
              订阅管理说明
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 启用通知后，当订阅的任务内容发生变化时将收到邮件通知
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 可以为每个订阅单独配置邮箱通知设置
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 停用通知后将不再收到邮件，但订阅记录会保留
          </Typography>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Paper
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            我的订阅列表
          </Typography>
        </Box>
        {subscriptions.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(25, 118, 210, 0.1)',
                color: '#1976d2',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
              }}
            >
              <SubscriptionsIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              暂无订阅任务
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              前往"公开任务市场"订阅感兴趣的任务
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/public-tasks"
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              浏览公开任务
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.05)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>任务信息</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>任务URL</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>通知状态</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>邮箱配置</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>订阅时间</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow
                    key={subscription.id}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.03)' },
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
                            background: subscription.is_active
                              ? 'linear-gradient(45deg, #10b981 30%, #059669 90%)'
                              : 'linear-gradient(45deg, #ef4444 30%, #dc2626 90%)',
                            fontSize: '1rem',
                          }}
                        >
                          {subscription.task_name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {subscription.task_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            创建者：{subscription.task_owner}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinkIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                        <Tooltip title={subscription.task_url} arrow>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {subscription.task_url}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={subscription.is_active ? '已启用' : '已停用'}
                        color={subscription.is_active ? 'success' : 'default'}
                        icon={subscription.is_active ? <NotificationsActiveIcon /> : <NotificationsOffIcon />}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {subscription.email_config_id
                            ? emailConfigs.find(c => c.id === subscription.email_config_id)?.name || '未知配置'
                            : '默认配置'
                          }
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(subscription.created_at).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="编辑订阅">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditDialog(subscription)}
                            sx={{
                              color: '#1976d2',
                              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="取消订阅">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSubscription(subscription.id)}
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
      </Paper>

      {/* 编辑订阅对话框 */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h5" component="div">
              编辑订阅设置
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingSubscription && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                任务：{editingSubscription.task_name}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    color="primary"
                  />
                }
                label="启用邮件通知"
                sx={{ mb: 2 }}
              />

              {formData.is_active && (
                <TextField
                  select
                  fullWidth
                  label="邮箱配置"
                  value={formData.email_config_id || ''}
                  onChange={(e) => setFormData({ ...formData, email_config_id: e.target.value || null })}
                  sx={{ mb: 2 }}
                  SelectProps={{ native: true }}
                >
                  <option value="">使用默认配置</option>
                  {emailConfigs.map((config) => (
                    <option key={config.id} value={config.id}>
                      {config.name} ({config.smtp_user})
                    </option>
                  ))}
                </TextField>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEditDialog} color="inherit">
            取消
          </Button>
          <Button onClick={handleUpdateSubscription} variant="contained">
            保存设置
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MySubscriptions;