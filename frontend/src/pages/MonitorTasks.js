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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as TestIcon,
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
  });

  const queryClient = useQueryClient();

  // 获取监控任务
  const { data: tasks = [], error } = useQuery(
    'monitor-tasks',
    async () => {
      const response = await axios.get('/api/monitor-tasks');
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
      });
    } else {
      setEditingTask(null);
      setFormData({
        name: '',
        url: '',
        xpath: '',
        interval: 300,
        is_active: true,
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">监控任务</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          添加任务
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>任务名称</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>检查间隔</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>最后检查</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {task.url}
                  </Typography>
                </TableCell>
                <TableCell>{task.interval}秒</TableCell>
                <TableCell>
                  <Chip
                    label={task.is_active ? '启用' : '禁用'}
                    color={task.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {task.last_check
                    ? new Date(task.last_check).toLocaleString()
                    : '未检查'}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleTest(task.id)}
                    title="测试"
                  >
                    <TestIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(task)}
                    title="编辑"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(task.id)}
                    title="删除"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 添加/编辑任务对话框 */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTask ? '编辑监控任务' : '添加监控任务'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="任务名称"
                  fullWidth
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  <Typography>启用监控</Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingTask ? '更新' : '添加'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default MonitorTasks;