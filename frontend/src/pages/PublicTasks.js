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
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import {
  Public as PublicIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  BookmarkBorder as SubscribeIcon,
  BookmarkRemove as UnsubscribeIcon,
  Info as InfoIcon,
  Monitor as MonitorIcon,
  Schedule as ScheduleIcon,
  Link as LinkIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const PublicTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    current_subscriptions: 0,
    max_subscriptions: 10,
    remaining_slots: 10,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [emailConfigs, setEmailConfigs] = useState([]);
  const [emailConfigDialogOpen, setEmailConfigDialogOpen] = useState(false);
  const [selectedEmailConfig, setSelectedEmailConfig] = useState('');

  // 获取公开任务列表
  const fetchPublicTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/public-tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('获取公开任务失败:', error);
      setSnackbar({
        open: true,
        message: '获取公开任务失败: ' + (error.response?.data?.detail || '未知错误'),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取订阅信息
  const fetchSubscriptionInfo = async () => {
    try {
      const response = await axios.get('/api/subscription-info');
      setSubscriptionInfo(response.data);
    } catch (error) {
      console.error('获取订阅信息失败:', error);
    }
  };

  // 获取邮箱配置列表
  const fetchEmailConfigs = async () => {
    try {
      const response = await axios.get('/api/email-configs/simple-list');
      setEmailConfigs(response.data);
    } catch (error) {
      console.error('获取邮箱配置失败:', error);
    }
  };

  useEffect(() => {
    fetchPublicTasks();
    fetchSubscriptionInfo();
    fetchEmailConfigs();
  }, []);

  // 切换订阅状态
  const handleToggleSubscription = async (taskId) => {
    try {
      const response = await axios.post(`/api/subscriptions/${taskId}/toggle`);

      setSnackbar({
        open: true,
        message: response.data.message,
        severity: 'success',
      });

      // 刷新数据
      fetchPublicTasks();
      fetchSubscriptionInfo();
    } catch (error) {
      console.error('订阅操作失败:', error);
      const errorMessage = error.response?.data?.detail || '未知错误';

      // 如果是邮箱配置相关的错误，打开邮箱配置选择对话框
      if (errorMessage.includes('邮箱配置') || errorMessage.includes('邮件通知设置')) {
        setSelectedTask(taskId);
        setSelectedEmailConfig('');
        setEmailConfigDialogOpen(true);
      } else {
        setSnackbar({
          open: true,
          message: '操作失败: ' + errorMessage,
          severity: 'error',
        });
      }
    }
  };

  // 带邮箱配置的订阅
  const handleSubscribeWithEmail = async () => {
    try {
      const response = await axios.post(
        `/api/subscriptions/${selectedTask}/subscribe-with-email`,
        { email_config_id: selectedEmailConfig }
      );

      setSnackbar({
        open: true,
        message: response.data.message,
        severity: 'success',
      });

      // 关闭对话框并刷新数据
      setEmailConfigDialogOpen(false);
      setSelectedTask(null);
      setSelectedEmailConfig('');
      fetchPublicTasks();
      fetchSubscriptionInfo();
    } catch (error) {
      console.error('带邮箱配置订阅失败:', error);
      setSnackbar({
        open: true,
        message: '操作失败: ' + (error.response?.data?.detail || '未知错误'),
        severity: 'error',
      });
    }
  };

  // 查看任务详情
  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  };

  // 关闭提示
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 表格列定义
  const columns = [
    {
      field: 'name',
      headerName: '任务名称',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PublicIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'url',
      headerName: '监控URL',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
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
              {params.value}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'description',
      headerName: '描述',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'owner_username',
      headerName: '创建者',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'subscription_count',
      headerName: '订阅数',
      width: 100,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color="primary"
          icon={<PeopleIcon />}
          variant="outlined"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: '创建时间',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title={params.row.user_subscribed ? "取消订阅" : "订阅任务"}>
            <Button
              size="small"
              variant={params.row.user_subscribed ? "outlined" : "contained"}
              color={params.row.user_subscribed ? "secondary" : "primary"}
              startIcon={params.row.user_subscribed ? <UnsubscribeIcon /> : <SubscribeIcon />}
              onClick={() => handleToggleSubscription(params.row.id)}
              disabled={!params.row.user_subscribed && subscriptionInfo.remaining_slots <= 0}
            >
              {params.row.user_subscribed ? "取消订阅" : "订阅"}
            </Button>
          </Tooltip>
          <Tooltip title="查看详情">
            <IconButton
              size="small"
              onClick={() => handleViewDetails(params.row)}
              sx={{
                color: 'info.main',
                '&:hover': {
                  backgroundColor: alpha('#0288d1', 0.08),
                },
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

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
            公开任务市场
          </Typography>
          <Typography variant="body1" color="text.secondary">
            发现和订阅其他用户分享的监控任务
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
                  <PublicIcon />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                  {tasks.length}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  公开任务
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
                  <PeopleIcon />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                  {subscriptionInfo.current_subscriptions}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  我的订阅
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
                background: 'linear-gradient(90deg, #22d3ee 0%, rgba(34, 211, 238, 0.6) 100%)',
              },
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: subscriptionInfo.remaining_slots > 0 ? 'rgba(34, 211, 238, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: subscriptionInfo.remaining_slots > 0 ? '#22d3ee' : '#ef4444',
                    width: 48,
                    height: 48,
                  }}
                >
                  {subscriptionInfo.remaining_slots > 0 ? <SuccessIcon /> : <PeopleIcon />}
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                  {subscriptionInfo.remaining_slots}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  剩余额度
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
                  {tasks.reduce((sum, task) => sum + task.subscription_count, 0)}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  总订阅数
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 订阅信息卡片 */}
      <Card sx={{ mb: 4, backgroundColor: alpha('#1976d2', 0.04), border: `1px solid ${alpha('#1976d2', 0.12)}` }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <PeopleIcon sx={{ fontSize: 20, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
              订阅使用情况
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 当前已订阅 {subscriptionInfo.current_subscriptions} 个任务，最多可订阅 {subscriptionInfo.max_subscriptions} 个
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 剩余订阅额度：{subscriptionInfo.remaining_slots} 个
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            • 订阅任务后，当任务监控到内容变化时，您会收到邮件通知
          </Typography>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Paper
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            公开任务列表
          </Typography>
        </Box>
        {tasks.length === 0 ? (
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
              <PublicIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              暂无公开任务
            </Typography>
            <Typography variant="body2" color="text.secondary">
              当前没有用户分享公开的监控任务
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.05)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>任务信息</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>创建者</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>订阅数</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>检查间隔</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>创建时间</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
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
                            background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                            fontSize: '1rem',
                          }}
                        >
                          {task.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {task.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <LinkIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                maxWidth: 200,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {task.url}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">{task.owner_username}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={task.subscription_count}
                        color="primary"
                        icon={<PeopleIcon />}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {task.interval}秒
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(task.created_at).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Tooltip title={task.user_subscribed ? "取消订阅" : "订阅任务"}>
                          <Button
                            size="small"
                            variant={task.user_subscribed ? "outlined" : "contained"}
                            color={task.user_subscribed ? "secondary" : "primary"}
                            startIcon={task.user_subscribed ? <UnsubscribeIcon /> : <SubscribeIcon />}
                            onClick={() => handleToggleSubscription(task.id)}
                            disabled={!task.user_subscribed && subscriptionInfo.remaining_slots <= 0}
                          >
                            {task.user_subscribed ? "取消订阅" : "订阅"}
                          </Button>
                        </Tooltip>
                        <Tooltip title="查看详情">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(task)}
                            sx={{
                              color: 'info.main',
                              '&:hover': { backgroundColor: 'rgba(0, 188, 212, 0.1)' },
                            }}
                          >
                            <InfoIcon />
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

      {/* 任务详情对话框 */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PublicIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h5" component="div">
              任务详情
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {selectedTask.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                创建者：{selectedTask.owner_username} | 创建时间：{new Date(selectedTask.created_at).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedTask.description || '暂无描述'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                监控URL：{selectedTask.url}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                订阅人数：{selectedTask.subscription_count}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDetailDialogOpen(false)} color="inherit">
            关闭
          </Button>
          {selectedTask && (
            <Button
              onClick={() => {
                handleToggleSubscription(selectedTask.id);
                setDetailDialogOpen(false);
              }}
              variant={selectedTask.user_subscribed ? "outlined" : "contained"}
              color={selectedTask.user_subscribed ? "secondary" : "primary"}
              disabled={!selectedTask.user_subscribed && subscriptionInfo.remaining_slots <= 0}
            >
              {selectedTask.user_subscribed ? "取消订阅" : "订阅任务"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* 邮箱配置选择对话框 */}
      <Dialog
        open={emailConfigDialogOpen}
        onClose={() => setEmailConfigDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            选择邮箱配置
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            订阅任务需要配置邮件通知，请选择要使用的邮箱配置
          </Typography>
        </DialogTitle>
        <DialogContent>
          {emailConfigs.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              您还没有配置邮箱通知设置。请先在"邮件通知配置"页面添加邮箱配置后再订阅任务。
            </Alert>
          ) : (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="email-config-select-label">邮箱配置</InputLabel>
              <Select
                labelId="email-config-select-label"
                value={selectedEmailConfig}
                label="邮箱配置"
                onChange={(e) => setSelectedEmailConfig(e.target.value)}
              >
                {emailConfigs.map((config) => (
                  <MenuItem key={config.id} value={config.id}>
                    {config.name} ({config.smtp_user} → {config.receiver_email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEmailConfigDialogOpen(false)}
            color="inherit"
          >
            取消
          </Button>
          {emailConfigs.length > 0 && (
            <Button
              onClick={handleSubscribeWithEmail}
              variant="contained"
              disabled={!selectedEmailConfig}
            >
              确认订阅
            </Button>
          )}
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

export default PublicTasks;