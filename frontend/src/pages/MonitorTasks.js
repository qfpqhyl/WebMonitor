import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Switch,
  Chip,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as TestIcon,
  Monitor as MonitorIcon,
  NotificationsActive as NotificationsIcon,
  Schedule as ScheduleIcon,
  CheckCircle as SuccessIcon,
  Pause as PauseIcon,
  Link as LinkIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const MonitorTasks = () => {
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    xpath: '',
    interval: 300,
    is_active: true,
    email_config_id: '',
  });

  const queryClient = useQueryClient();

  // 获取邮箱配置名称的辅助函数
  const getEmailConfigName = (task) => {
    if (!task || !task.email_config_id) {
      return '未设置';
    }
    const config = emailConfigs.find(c => c.id === task.email_config_id);
    return config ? config.name : '未知配置';
  };

  // 获取监控任务
  const { data: tasks = [], error } = useQuery(
    'monitor-tasks',
    async () => {
      const response = await axios.get('/api/monitor-tasks');
      return response.data;
    }
  );

  // 获取邮箱配置列表
  const { data: emailConfigs = [] } = useQuery(
    'emailConfigs',
    async () => {
      const response = await axios.get('/api/email-configs/simple-list');
      return response.data;
    }
  );

  // 创建任务
  const createMutation = useMutation(
    async (taskData) => {
      const response = await axios.post('/api/monitor-tasks', taskData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('monitor-tasks');
        handleClose();
      },
    }
  );

  // 更新任务
  const updateMutation = useMutation(
    async ({ id, taskData }) => {
      const response = await axios.put(`/api/monitor-tasks/${id}`, taskData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('monitor-tasks');
        handleClose();
      },
    }
  );

  // 删除任务
  const deleteMutation = useMutation(
    async (id) => {
      await axios.delete(`/api/monitor-tasks/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('monitor-tasks');
      },
    }
  );

  // 测试任务
  const testMutation = useMutation(
    async (id) => {
      const response = await axios.post(`/api/monitor-tasks/${id}/test`);
      return response.data;
    }
  );

  const handleOpen = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        name: task.name,
        url: task.url,
        xpath: task.xpath,
        interval: task.interval,
        is_active: task.is_active,
        email_config_id: task.email_config_id || '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        name: '',
        url: '',
        xpath: '',
        interval: 300,
        is_active: true,
        email_config_id: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, taskData: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个监控任务吗？')) {
      deleteMutation.mutate(id);
    }
  };

  const handleTest = (id) => {
    testMutation.mutate(id, {
      onSuccess: (data) => {
        alert(`测试成功！\\n内容: ${data.content?.substring(0, 100)}...`);
      },
      onError: (error) => {
        alert(`测试失败: ${error.response?.data?.detail || error.message}`);
      },
    });
  };

  if (error) {
    return <Alert severity="error">加载监控任务失败: {error.message}</Alert>;
  }

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
            监控任务管理
          </Typography>
          <Typography variant="body1" color="text.secondary">
            管理和配置您的网页监控任务
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          创建新任务
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
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <MonitorIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {tasks.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总任务数
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
                  <SuccessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {tasks.filter(task => task.is_active).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    活跃任务
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
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <PauseIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {tasks.filter(task => !task.is_active).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    暂停任务
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
                  <NotificationsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {tasks.filter(task => task.email_config_id).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    邮件通知
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
            监控任务列表
          </Typography>
        </Box>
        {tasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
              }}
            >
              <MonitorIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1 }}>
              暂无监控任务
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              创建您的第一个监控任务开始监控网页内容变化
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              创建第一个任务
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>任务信息</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>监控配置</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>检查间隔</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>邮件通知</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>状态</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.03)' },
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
                            background: task.is_active
                              ? 'linear-gradient(45deg, #10b981 30%, #059669 90%)'
                              : 'linear-gradient(45deg, #ef4444 30%, #dc2626 90%)',
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
                      <Typography variant="body2" color="text.secondary">
                        {task.xpath ? task.xpath.substring(0, 50) + '...' : '未设置'}
                      </Typography>
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
                      <Chip
                        size="small"
                        label={getEmailConfigName(task)}
                        color={task.email_config_id ? 'primary' : 'default'}
                        variant={task.email_config_id ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={task.is_active ? <SuccessIcon /> : <PauseIcon />}
                        label={task.is_active ? '运行中' : '已暂停'}
                        color={task.is_active ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="测试监控">
                          <IconButton
                            size="small"
                            onClick={() => handleTest(task.id)}
                            sx={{
                              color: '#10b981',
                              '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                            }}
                          >
                            <TestIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="编辑任务">
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(task)}
                            sx={{
                              color: '#2563eb',
                              '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.1)' },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除任务">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(task.id)}
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

      {/* Enhanced Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
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
            background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
            color: 'white',
            py: 3,
            '& .MuiTypography-root': {
              fontWeight: 700,
            },
          }}
        >
          {editingTask ? '编辑监控任务' : '创建新监控任务'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="任务名称"
                  fullWidth
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="监控URL"
                  fullWidth
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="XPath选择器"
                  fullWidth
                  value={formData.xpath}
                  onChange={(e) =>
                    setFormData({ ...formData, xpath: e.target.value })
                  }
                  helperText="用于定位监控内容的XPath表达式"
                  required
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="检查间隔（秒）"
                  type="number"
                  fullWidth
                  value={formData.interval}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      interval: parseInt(e.target.value) || 300,
                    })
                  }
                  inputProps={{ min: 10 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="email-config-label">邮箱配置</InputLabel>
                  <Select
                    labelId="email-config-label"
                    value={formData.email_config_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email_config_id: e.target.value,
                      })
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'rgba(16, 185, 129, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981',
                          borderWidth: 2,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>不使用邮件通知</em>
                    </MenuItem>
                    {emailConfigs.map((config) => (
                      <MenuItem key={config.id} value={config.id}>
                        {config.name} ({config.smtp_user} → {config.receiver_email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_active: e.target.checked,
                      })
                    }
                    sx={{
                      '& .MuiSwitch-thumb': {
                        backgroundColor: formData.is_active ? '#10b981' : 'default',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: formData.is_active ? 'rgba(16, 185, 129, 0.5)' : 'default',
                      },
                    }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      启用监控
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      立即开始监控指定网页
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleClose}
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
              disabled={createMutation.isLoading || updateMutation.isLoading}
              sx={{
                background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #059669 30%, #047857 90%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                },
              }}
            >
              {editingTask ? '更新任务' : '创建任务'}
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
            borderColor: 'rgba(16, 185, 129, 0.5)',
            color: '#10b981',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            },
          }}
        >
          访问 GitHub 仓库
        </Button>
      </Box>
    </Box>
  );
};

export default MonitorTasks;