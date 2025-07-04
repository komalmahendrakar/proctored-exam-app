import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Tag, Timeline, Badge, Row, Col,Statistic}from 'antd';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { WarningOutlined, LaptopOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const TeacherDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'keertana',
      status: 'Active',
      riskLevel: 'high',
      flags: 5,
      tabSwitches: 12,
      faceDetectionIssues: 3,
      timeline: [
        { time: '10:05 AM', event: 'Multiple faces detected', severity: 'high' },
        { time: '10:10 AM', event: 'Tab switch detected', severity: 'medium' },
        { time: '10:15 AM', event: 'Background noise detected', severity: 'low' },
      ],
    },
    // Add more student objects...
  ]);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents(prev => prev.map(student => ({
        ...student,
        flags: student.flags + Math.floor(Math.random() * 2),
        tabSwitches: student.tabSwitches + Math.floor(Math.random() * 3),
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Chart Data
  const activityData = students.map(student => ({
    name: student.name,
    flags: student.flags,
    tabSwitches: student.tabSwitches,
  }));

  const riskDistributionData = [
    { name: 'High Risk', value: students.filter(s => s.riskLevel === 'high').length },
    { name: 'Medium Risk', value: students.filter(s => s.riskLevel === 'medium').length },
    { name: 'Low Risk', value: students.filter(s => s.riskLevel === 'low').length },
  ];

  const COLORS = ['#ff4d4f', '#faad14', '#52c41a'];

  const columns = [
    {
      title: 'Student',
      dataIndex: 'name',
      render: (text, record) => (
        <div className="student-info">
          <UserOutlined style={{ marginRight: 8 }} />
          {text}
          {record.riskLevel === 'high' && <Badge count="!" style={{ backgroundColor: '#ff4d4f', marginLeft: 8 }} />}
        </div>
      ),
    },
    {
      title: 'Risk Level',
      dataIndex: 'riskLevel',
      render: (text) => (
        <Tag color={
          text === 'high' ? 'red' : 
          text === 'medium' ? 'orange' : 'green'
        }>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Flags',
      dataIndex: 'flags',
      sorter: (a, b) => a.flags - b.flags,
    },
    {
      title: 'Tab Switches',
      dataIndex: 'tabSwitches',
      sorter: (a, b) => a.tabSwitches - b.tabSwitches,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <div className="logo" style={{ height: 64, background: '#001529', color: 'white', padding: 16 }}>
          <h2>Exam Monitor</h2>
        </div>
        <Card 
          title="Exam Status" 
          bordered={false}
          headStyle={{ color: 'white' }}
          style={{ background: 'transparent', color: 'white' }}
        >
          <div className="exam-stats">
            <Statistic
              title="Total Students"
              value={students.length}
              valueStyle={{ color: 'white' }}
            />
            <Statistic
              title="Active Alerts"
              value={students.filter(s => s.riskLevel === 'high').length}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </div>
        </Card>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <div className="header-content" style={{ padding: '0 24px' }}>
            <h2>Live Proctoring Dashboard</h2>
          </div>
        </Header>

        <Content style={{ margin: '24px 16px' }}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card title="Overall Activity">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="flags" fill="#ff4d4f" />
                    <Bar dataKey="tabSwitches" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Risk Distribution">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Recent Alerts">
                <Timeline mode="alternate">
                  {students.flatMap(student => 
                    student.timeline.map((event, index) => (
                      <Timeline.Item
                        key={`${student.id}-${index}`}
                        color={
                          event.severity === 'high' ? 'red' :
                          event.severity === 'medium' ? 'orange' : 'green'
                        }
                      >
                        <p>{student.name}</p>
                        <p>{event.event}</p>
                        <p>{event.time}</p>
                      </Timeline.Item>
                    ))
                  ).slice(0, 5)}
                </Timeline>
              </Card>
            </Col>
          </Row>

          <Card title="Student Overview" style={{ marginTop: 24 }}>
            <Table
              columns={columns}
              dataSource={students}
              rowKey="id"
              onRow={(record) => ({
                onClick: () => setSelectedStudent(record),
              })}
              rowClassName="clickable-row"
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeacherDashboard;