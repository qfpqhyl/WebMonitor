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
  Button,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Code as CodeIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
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
            监控日志
          </Typography>
          <Typography variant="body1" color="text.secondary">
            查看和分析监控任务的执行记录
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>选择监控任务</InputLabel>
          <Select
            value={selectedTaskId}
            label="选择监控任务"
            onChange={handleTaskChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'rgba(25, 118, 210, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                  borderWidth: 2,
                },
              },
            }}
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
        <Alert severity="error" sx={{ mb: 3 }}>
          加载监控日志失败: {error.message}
        </Alert>
      )}

      {selectedTaskId ? (
        <>
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
                      <ListAltIcon />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                      {totalCount}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      总日志数
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
                      <CheckCircleIcon />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                      {logs.filter(log => !log.error_message && !log.is_changed).length}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      无变化
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
                    background: 'linear-gradient(90deg, #f59e0b 0%, rgba(245, 158, 11, 0.6) 100%)',
                  },
                  position: 'relative',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        width: 48,
                        height: 48,
                      }}
                    >
                      <WarningIcon />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                      {logs.filter(log => log.is_changed && !log.error_message).length}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      内容变化
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
                      <ErrorIcon />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                      {logs.filter(log => log.error_message).length}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      错误
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Logs Table */}
          <Paper
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                监控日志记录
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>检查时间</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>状态</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>新内容</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>错误信息</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow
                      key={log.id}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.03)' },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {formatDate(log.check_time)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {log.error_message ? (
                          <Chip
                            label="错误"
                            color="error"
                            size="small"
                            icon={<ErrorIcon />}
                            variant="outlined"
                          />
                        ) : log.is_changed ? (
                          <Chip
                            label="内容变化"
                            color="warning"
                            size="small"
                            icon={<WarningIcon />}
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            label="无变化"
                            color="success"
                            size="small"
                            icon={<CheckCircleIcon />}
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 300,
                            wordBreak: 'break-word',
                          }}
                        >
                          {truncateContent(log.new_content)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{
                            maxWidth: 300,
                            wordBreak: 'break-word',
                          }}
                        >
                          {truncateContent(log.error_message)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 8 }}>
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
                          <ListAltIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          暂无监控日志
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          该任务还没有执行过监控
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 分页组件 */}
            {totalCount > 0 && (
              <Box sx={{ p: 3, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
              </Box>
            )}
          </Paper>
        </>
      ) : (
        <Paper
          sx={{
            borderRadius: 4,
            border: '1px solid rgba(0, 0, 0, 0.06)',
            p: 8,
            textAlign: 'center',
          }}
        >
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
            <ListAltIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1 }}>
            请选择监控任务
          </Typography>
          <Typography variant="body2" color="text.secondary">
            选择一个监控任务查看其执行日志
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