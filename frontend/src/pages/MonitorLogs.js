import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
} from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';

const MonitorLogs = () => {
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // 获取监控任务列表
  const { data: tasks = [] } = useQuery('monitor-tasks', async () => {
    const response = await axios.get('/api/monitor-tasks');
    return response.data;
  });

  // 获取监控日志
  const { data: logs = [], error } = useQuery(
    ['monitor-logs', selectedTaskId],
    async () => {
      if (!selectedTaskId) return [];
      const response = await axios.get(`/api/monitor-tasks/${selectedTaskId}/logs`);
      return response.data;
    },
    {
      enabled: !!selectedTaskId,
    }
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '-';
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        监控日志
      </Typography>

      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>选择监控任务</InputLabel>
          <Select
            value={selectedTaskId}
            label="选择监控任务"
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            {tasks.map((task) => (
              <MenuItem key={task.id} value={task.id}>
                {task.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          加载监控日志失败: {error.message}
        </Alert>
      )}

      {selectedTaskId ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>检查时间</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>新内容</TableCell>
                <TableCell>错误信息</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.check_time)}</TableCell>
                  <TableCell>
                    {log.error_message ? (
                      <Chip label="错误" color="error" size="small" />
                    ) : log.is_changed ? (
                      <Chip label="内容变化" color="warning" size="small" />
                    ) : (
                      <Chip label="无变化" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300 }}>
                      {truncateContent(log.new_content)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ maxWidth: 300 }}
                    >
                      {truncateContent(log.error_message)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary">
                      暂无监控日志
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            请选择一个监控任务查看日志
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MonitorLogs;