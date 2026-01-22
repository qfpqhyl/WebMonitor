import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Divider,
  IconButton,
  Drawer,
  alpha,
  Chip,
  Stack,
} from '@mui/material';
import {
  Monitor as MonitorIcon,
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  RocketLaunch as RocketIcon,
  Assignment as TaskIcon,
  Email as EmailIcon,
  Public as PublicIcon,
  Dashboard as DashboardIcon,
  Help as HelpIcon,
  Code as CodeIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Code Block Component
const CodeBlock = ({ children, language = 'text' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: '#1e293b',
        borderRadius: 2,
        p: 2,
        my: 2,
        overflow: 'auto',
      }}
    >
      <IconButton
        onClick={handleCopy}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: '#94a3b8',
          '&:hover': { color: '#ffffff' },
        }}
      >
        {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
      </IconButton>
      <Typography
        component="pre"
        sx={{
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          fontSize: '0.875rem',
          color: '#e2e8f0',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

// Section Component
const DocSection = ({ id, title, icon, children }) => {
  return (
    <Box
      id={id}
      component={motion.section}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      sx={{ mb: 8, scrollMarginTop: '100px' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            backgroundColor: alpha('#10b981', 0.1),
            color: '#10b981',
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: '#334155',
            fontSize: { xs: '1.5rem', md: '1.75rem' },
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

// Subsection Component
const SubSection = ({ title, children }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        component="h3"
        sx={{
          fontWeight: 600,
          color: '#334155',
          mb: 2,
          pb: 1,
          borderBottom: '2px solid',
          borderColor: alpha('#10b981', 0.3),
          display: 'inline-block',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ color: '#64748b', lineHeight: 1.8 }}>{children}</Box>
    </Box>
  );
};

// Tip Box Component
const TipBox = ({ type = 'info', children }) => {
  const colors = {
    info: { bg: '#2563eb', light: alpha('#2563eb', 0.08) },
    warning: { bg: '#f59e0b', light: alpha('#f59e0b', 0.08) },
    success: { bg: '#10b981', light: alpha('#10b981', 0.08) },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        my: 2,
        borderRadius: 2,
        backgroundColor: colors[type].light,
        borderLeft: `4px solid ${colors[type].bg}`,
      }}
    >
      <Typography variant="body2" sx={{ color: '#334155' }}>
        {children}
      </Typography>
    </Paper>
  );
};

const Documentation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('quick-start');

  const sections = [
    { id: 'quick-start', title: '快速开始', icon: <RocketIcon /> },
    { id: 'monitor-tasks', title: '监控任务', icon: <TaskIcon /> },
    { id: 'email-config', title: '邮件配置', icon: <EmailIcon /> },
    { id: 'public-tasks', title: '公开任务与订阅', icon: <PublicIcon /> },
    { id: 'dashboard', title: '仪表板与日志', icon: <DashboardIcon /> },
    { id: 'faq', title: '常见问题', icon: <HelpIcon /> },
  ];

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const sidebarWidth = 260;

  const SidebarContent = () => (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="overline"
        sx={{
          color: '#94a3b8',
          fontWeight: 600,
          letterSpacing: 1,
          px: 2,
          mb: 1,
          display: 'block',
        }}
      >
        文档目录
      </Typography>
      <List sx={{ pt: 0 }}>
        {sections.map((section) => (
          <ListItemButton
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              backgroundColor: activeSection === section.id ? alpha('#10b981', 0.1) : 'transparent',
              color: activeSection === section.id ? '#10b981' : '#64748b',
              '&:hover': {
                backgroundColor: alpha('#10b981', 0.08),
                color: '#10b981',
              },
            }}
          >
            <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>
              {React.cloneElement(section.icon, {
                sx: { fontSize: 20, color: activeSection === section.id ? '#10b981' : '#94a3b8' }
              })}
            </Box>
            <ListItemText
              primary={section.title}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: activeSection === section.id ? 600 : 500,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${alpha('#e2e8f0', 0.3)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha('#e2e8f0', 0.3)} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Navigation */}
      <Box
        component={motion.nav}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mobile menu button */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { md: 'none' }, color: '#64748b' }}
              >
                <MenuIcon />
              </IconButton>

              <Box
                onClick={() => navigate('/')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  }}
                >
                  <MonitorIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#334155',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  WebMonitor
                </Typography>
              </Box>

              <Chip
                label="文档"
                size="small"
                sx={{
                  backgroundColor: alpha('#10b981', 0.1),
                  color: '#10b981',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{
                  color: '#64748b',
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': { color: '#10b981' },
                }}
              >
                返回首页
              </Button>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ color: '#64748b', '&:hover': { color: '#10b981' } }}
              >
                登录
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  px: 2,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                  },
                }}
              >
                免费注册
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            backgroundColor: '#ffffff',
            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <Box sx={{ pt: 8 }}>
          <SidebarContent />
        </Box>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          top: 72,
          left: 0,
          width: sidebarWidth,
          height: 'calc(100vh - 72px)',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          overflowY: 'auto',
          zIndex: 1000,
        }}
      >
        <SidebarContent />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          pt: '72px',
          pl: { xs: 0, md: `${sidebarWidth}px` },
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="md" sx={{ py: 6, px: { xs: 3, md: 4 } }}>
          {/* Header */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ mb: 8, textAlign: 'center' }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#334155',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.02em',
              }}
            >
              使用文档
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                fontWeight: 400,
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              了解如何使用 WebMonitor 监控网页内容变化并获取即时通知
            </Typography>
          </Box>

          {/* Quick Start Section */}
          <DocSection id="quick-start" title="快速开始" icon={<RocketIcon />}>
            <Typography paragraph sx={{ color: '#64748b', lineHeight: 1.8 }}>
              欢迎使用 WebMonitor！只需几个简单的步骤，您就可以开始监控任何网页的内容变化。
            </Typography>

            <SubSection title="1. 注册账户">
              <Typography paragraph>
                访问 <strong>注册页面</strong>，填写用户名、邮箱和密码即可创建账户。注册成功后，系统会自动跳转到登录页面。
              </Typography>
              <TipBox type="info">
                请使用有效的邮箱地址，以便接收监控通知。
              </TipBox>
            </SubSection>

            <SubSection title="2. 创建邮件配置">
              <Typography paragraph>
                在创建监控任务之前，您需要先配置邮件通知。进入 <strong>邮件配置</strong> 页面，添加您的 SMTP 服务器信息。
              </Typography>
              <Typography paragraph>
                邮件配置包括：SMTP 服务器地址、端口、发件人邮箱、密码和收件人邮箱。
              </Typography>
            </SubSection>

            <SubSection title="3. 创建监控任务">
              <Typography paragraph>
                进入 <strong>监控任务</strong> 页面，点击"创建任务"按钮，填写以下信息：
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li>任务名称：便于识别的任务描述</li>
                <li>监控URL：要监控的网页地址</li>
                <li>XPath选择器：定位要监控的内容元素</li>
                <li>检查间隔：多久检查一次（秒）</li>
                <li>邮件配置：选择用于通知的邮件配置</li>
              </Box>
            </SubSection>

            <SubSection title="4. 查看监控结果">
              <Typography paragraph>
                创建任务后，系统会按照设定的间隔自动检查网页内容。您可以在 <strong>仪表板</strong> 查看监控状态，
                在 <strong>监控日志</strong> 中查看详细的检查记录。当检测到内容变化时，您会收到邮件通知。
              </Typography>
            </SubSection>
          </DocSection>

          {/* Monitor Tasks Section */}
          <DocSection id="monitor-tasks" title="监控任务" icon={<TaskIcon />}>
            <SubSection title="什么是监控任务">
              <Typography paragraph>
                监控任务是 WebMonitor 的核心功能。每个任务负责监控一个网页上的特定内容，当内容发生变化时发送通知。
              </Typography>
              <Typography paragraph>
                WebMonitor 使用 <strong>Selenium WebDriver</strong> 技术，能够处理 JavaScript 动态渲染的内容，
                确保即使是复杂的现代网页也能准确监控。
              </Typography>
            </SubSection>

            <SubSection title="XPath 选择器使用指南">
              <Typography paragraph>
                XPath 是一种用于在网页中定位元素的语言。以下是一些常用的 XPath 表达式示例：
              </Typography>

              <Typography variant="subtitle2" sx={{ color: '#334155', mt: 2, mb: 1 }}>
                按 ID 选择：
              </Typography>
              <CodeBlock language="xpath">{`//*[@id="price"]`}</CodeBlock>

              <Typography variant="subtitle2" sx={{ color: '#334155', mt: 2, mb: 1 }}>
                按 class 选择：
              </Typography>
              <CodeBlock language="xpath">{`//div[@class="product-price"]`}</CodeBlock>

              <Typography variant="subtitle2" sx={{ color: '#334155', mt: 2, mb: 1 }}>
                按标签和文本选择：
              </Typography>
              <CodeBlock language="xpath">{`//span[contains(text(), "库存")]`}</CodeBlock>

              <Typography variant="subtitle2" sx={{ color: '#334155', mt: 2, mb: 1 }}>
                获取网页完整内容：
              </Typography>
              <CodeBlock language="xpath">{`//body`}</CodeBlock>

              <TipBox type="success">
                提示：在浏览器中按 F12 打开开发者工具，右键点击元素选择"复制 XPath"可快速获取。
              </TipBox>
            </SubSection>

            <SubSection title="监控间隔设置">
              <Typography paragraph>
                监控间隔决定了系统多久检查一次网页内容。设置范围：
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li><strong>最小间隔：</strong>10 秒</li>
                <li><strong>默认间隔：</strong>300 秒（5 分钟）</li>
                <li><strong>最大间隔：</strong>86400 秒（24 小时）</li>
              </Box>
              <TipBox type="warning">
                注意：过短的间隔可能导致目标网站限制访问，建议根据实际需要合理设置。
              </TipBox>
            </SubSection>

            <SubSection title="任务公开设置">
              <Typography paragraph>
                您可以将任务设为公开，让其他用户也能订阅并接收通知：
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li><strong>私有任务：</strong>只有您可以查看和管理</li>
                <li><strong>公开任务：</strong>出现在公开任务市场，其他用户可以订阅</li>
              </Box>
            </SubSection>

            <SubSection title="测试监控任务">
              <Typography paragraph>
                创建任务后，点击任务列表中的"测试"按钮，可以立即执行一次监控检查，验证 XPath 选择器是否正确配置。
              </Typography>
            </SubSection>
          </DocSection>

          {/* Email Config Section */}
          <DocSection id="email-config" title="邮件配置" icon={<EmailIcon />}>
            <SubSection title="配置 SMTP 服务器">
              <Typography paragraph>
                邮件配置用于设置发送通知的邮件服务器。您需要提供以下信息：
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li><strong>配置名称：</strong>便于识别的名称，如"工作邮箱"</li>
                <li><strong>SMTP 服务器：</strong>邮件服务器地址</li>
                <li><strong>SMTP 端口：</strong>服务器端口，通常是 465（SSL）或 587（TLS）</li>
                <li><strong>发件人邮箱：</strong>用于发送通知的邮箱地址</li>
                <li><strong>SMTP 密码：</strong>邮箱密码或应用专用密码</li>
                <li><strong>收件人邮箱：</strong>接收通知的邮箱地址</li>
              </Box>
            </SubSection>

            <SubSection title="常用邮箱 SMTP 设置">
              <Typography variant="subtitle2" sx={{ color: '#334155', mt: 2, mb: 1 }}>
                Gmail：
              </Typography>
              <CodeBlock>{`服务器: smtp.gmail.com
端口: 465 (SSL) 或 587 (TLS)
需要开启"应用专用密码"`}</CodeBlock>

              <Typography variant="subtitle2" sx={{ color: '#334155', mt: 2, mb: 1 }}>
                QQ 邮箱：
              </Typography>
              <CodeBlock>{`服务器: smtp.qq.com
端口: 465 (SSL)
需要开启SMTP服务并获取授权码`}</CodeBlock>

              <Typography variant="subtitle2" sx={{ color: '#334155', mt: 2, mb: 1 }}>
                163 邮箱：
              </Typography>
              <CodeBlock>{`服务器: smtp.163.com
端口: 465 (SSL)
需要开启SMTP服务并设置客户端授权密码`}</CodeBlock>

              <Typography variant="subtitle2" sx={{ color: '#334155', mt: 2, mb: 1 }}>
                Outlook/Hotmail：
              </Typography>
              <CodeBlock>{`服务器: smtp.office365.com
端口: 587 (TLS)`}</CodeBlock>

              <TipBox type="info">
                大多数邮箱服务商要求使用"应用专用密码"或"授权码"，而不是邮箱登录密码。请在邮箱设置中生成。
              </TipBox>
            </SubSection>

            <SubSection title="测试邮件发送">
              <Typography paragraph>
                配置完成后，点击"测试"按钮可以发送一封测试邮件，验证配置是否正确。如果收到测试邮件，说明配置成功。
              </Typography>
            </SubSection>
          </DocSection>

          {/* Public Tasks Section */}
          <DocSection id="public-tasks" title="公开任务与订阅" icon={<PublicIcon />}>
            <SubSection title="浏览公开任务">
              <Typography paragraph>
                在 <strong>公开任务</strong> 页面，您可以浏览其他用户分享的监控任务。每个任务显示：
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li>任务名称和描述</li>
                <li>监控的网址</li>
                <li>创建者信息</li>
                <li>检查间隔</li>
                <li>订阅人数</li>
              </Box>
            </SubSection>

            <SubSection title="订阅任务">
              <Typography paragraph>
                订阅公开任务后，当该任务检测到内容变化时，您也会收到邮件通知。订阅步骤：
              </Typography>
              <Box component="ol" sx={{ pl: 3, color: '#64748b' }}>
                <li>在公开任务列表中找到感兴趣的任务</li>
                <li>点击"订阅"按钮</li>
                <li>选择用于接收通知的邮件配置</li>
                <li>确认订阅</li>
              </Box>
              <TipBox type="info">
                订阅前需要先创建至少一个邮件配置。
              </TipBox>
            </SubSection>

            <SubSection title="管理订阅">
              <Typography paragraph>
                在 <strong>我的订阅</strong> 页面，您可以查看和管理所有订阅的任务：
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li>查看订阅的任务详情</li>
                <li>开启/关闭通知</li>
                <li>更换通知邮件配置</li>
                <li>取消订阅</li>
              </Box>
            </SubSection>

            <SubSection title="订阅限制">
              <Typography paragraph>
                每个用户有订阅数量限制（默认为 10 个）。如果需要更多订阅配额，请联系管理员。
              </Typography>
            </SubSection>
          </DocSection>

          {/* Dashboard Section */}
          <DocSection id="dashboard" title="仪表板与日志" icon={<DashboardIcon />}>
            <SubSection title="仪表板概览">
              <Typography paragraph>
                仪表板提供系统状态的整体视图，包括：
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li><strong>任务总数：</strong>您创建的监控任务数量</li>
                <li><strong>活跃任务：</strong>正在运行的任务数量</li>
                <li><strong>近期变化：</strong>最近检测到的内容变化数</li>
                <li><strong>成功率：</strong>监控检查的成功率</li>
                <li><strong>最近活动：</strong>最新的监控日志记录</li>
              </Box>
            </SubSection>

            <SubSection title="监控日志">
              <Typography paragraph>
                监控日志记录每次检查的详细信息：
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li><strong>检查时间：</strong>执行检查的时间戳</li>
                <li><strong>任务信息：</strong>任务名称和监控URL</li>
                <li><strong>检查结果：</strong>成功/失败状态</li>
                <li><strong>变化检测：</strong>是否检测到内容变化</li>
                <li><strong>内容预览：</strong>检测到的内容（如有变化）</li>
                <li><strong>错误信息：</strong>如果失败，显示错误原因</li>
              </Box>
            </SubSection>

            <SubSection title="监控状态说明">
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li><Chip label="正常" size="small" sx={{ backgroundColor: alpha('#10b981', 0.1), color: '#10b981', mr: 1 }} /> 检查成功，内容无变化</li>
                <li><Chip label="检测到变化" size="small" sx={{ backgroundColor: alpha('#f59e0b', 0.1), color: '#f59e0b', mr: 1, my: 0.5 }} /> 检查成功，检测到内容变化</li>
                <li><Chip label="失败" size="small" sx={{ backgroundColor: alpha('#ef4444', 0.1), color: '#ef4444', mr: 1 }} /> 检查失败，可能是网络或选择器问题</li>
              </Box>
            </SubSection>
          </DocSection>

          {/* FAQ Section */}
          <DocSection id="faq" title="常见问题" icon={<HelpIcon />}>
            <SubSection title="XPath 选择器不工作">
              <Typography paragraph>
                <strong>问题：</strong>创建任务后，无法获取到内容或总是显示空白。
              </Typography>
              <Typography paragraph>
                <strong>解决方案：</strong>
              </Typography>
              <Box component="ol" sx={{ pl: 3, color: '#64748b' }}>
                <li>使用浏览器开发者工具验证 XPath 是否正确</li>
                <li>确保目标元素不是通过 JavaScript 延迟加载的</li>
                <li>尝试使用更简单的选择器，如 <code>//body</code> 获取整个页面</li>
                <li>使用"测试"功能验证配置</li>
              </Box>
            </SubSection>

            <SubSection title="邮件发送失败">
              <Typography paragraph>
                <strong>问题：</strong>测试邮件发送失败，或收不到通知邮件。
              </Typography>
              <Typography paragraph>
                <strong>解决方案：</strong>
              </Typography>
              <Box component="ol" sx={{ pl: 3, color: '#64748b' }}>
                <li>检查 SMTP 服务器地址和端口是否正确</li>
                <li>确认使用的是应用专用密码而非登录密码</li>
                <li>检查邮箱是否开启了 SMTP 服务</li>
                <li>查看邮箱的垃圾邮件文件夹</li>
                <li>确认 SSL/TLS 设置与端口匹配</li>
              </Box>
            </SubSection>

            <SubSection title="监控任务无法创建">
              <Typography paragraph>
                <strong>问题：</strong>创建任务时提示域名被限制或无法创建。
              </Typography>
              <Typography paragraph>
                <strong>解决方案：</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li>某些域名可能被管理员加入黑名单，请联系管理员</li>
                <li>确保 URL 格式正确，包含 http:// 或 https://</li>
                <li>先创建邮件配置，再创建监控任务</li>
              </Box>
            </SubSection>

            <SubSection title="订阅限制">
              <Typography paragraph>
                <strong>问题：</strong>无法订阅更多公开任务，提示已达上限。
              </Typography>
              <Typography paragraph>
                <strong>解决方案：</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: '#64748b' }}>
                <li>取消不需要的订阅以释放配额</li>
                <li>联系管理员申请增加订阅配额</li>
              </Box>
            </SubSection>
          </DocSection>

          {/* Footer CTA */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              mt: 8,
              borderRadius: 4,
              backgroundColor: '#f8fafc',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#334155', mb: 2 }}
            >
              准备好开始监控了吗？
            </Typography>
            <Typography sx={{ color: '#64748b', mb: 4 }}>
              立即注册账号，体验专业的网页内容监控服务
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                }}
              >
                免费注册
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: '#e2e8f0',
                  color: '#475569',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#10b981',
                    color: '#10b981',
                  },
                }}
              >
                立即登录
              </Button>
            </Stack>
          </Paper>

          {/* Footer */}
          <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(0, 0, 0, 0.06)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              © 2024 WebMonitor. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Documentation;
