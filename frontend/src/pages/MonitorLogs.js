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
  Pagination,
  Grid,
  Card,
  CardContent,
  TablePagination,
  Button,
} from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';

const MonitorLogs = () => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 获取监控任务列表
  const { data: tasks = [] } = useQuery('monitor-tasks', async () => {
    const response = await axios.get('/api/monitor-tasks');
    return response.data;
  });

  // 获取监控日志
  const { data: logsData = [], error } = useQuery(
    ['monitor-logs', selectedTaskId, page, rowsPerPage],
    async () => {
      if (!selectedTaskId) return [];
      const response = await axios.get(
        `/api/monitor-tasks/${selectedTaskId}/logs?page=${page}&limit=${rowsPerPage}`
      );
      return response.data;
    },
    {
      enabled: !!selectedTaskId,
      keepPreviousData: true,
    }
  );

  // 处理分页数据
  const logs = Array.isArray(logsData) ? logsData : logsData?.logs || [];
  const totalCount = logsData?.total || logs.length || 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '-';
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  // 分页处理函数
  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // Material-UI Pagination 从 0 开始，API 从 1 开始
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // 重置到第一页
  };

  // 当选择任务时重置分页
  const handleTaskChange = (event) => {
    setSelectedTaskId(event.target.value);
    setPage(1);
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
            onChange={handleTaskChange}
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
        <>
          {/* 统计信息 */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary">
                    {totalCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总日志数
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {logs.filter(log => !log.error_message && !log.is_changed).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    无变化
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main">
                    {logs.filter(log => log.is_changed && !log.error_message).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    内容变化
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="error.main">
                    {logs.filter(log => log.error_message).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    错误
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

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

            {/* 分页组件 */}
            {totalCount > 0 && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                <Typography variant="body2" color="text.secondary">
                  显示第 {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, totalCount)} 条，共 {totalCount} 条记录
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    每页显示:
                  </Typography>
                  <Select
                    size="small"
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    sx={{ minWidth: 80 }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                  <Pagination
                    count={Math.ceil(totalCount / rowsPerPage)}
                    page={page - 1}
                    onChange={handleChangePage}
                    color="primary"
                    showFirstButton
                    showLastButton
                    shape="rounded"
                    size="medium"
                    siblingCount={2}
                    boundaryCount={1}
                  />
                </Box>
              </Box>
            )}
          </TableContainer>
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            请选择一个监控任务查看日志
          </Typography>
        </Paper>
      )}

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
            borderColor: 'rgba(25, 118, 210, 0.5)',
            color: '#1976d2',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
            },
          }}
        >
          访问 GitHub 仓库
        </Button>
      </Box>
    </Box>
  );
};

export default MonitorLogs;