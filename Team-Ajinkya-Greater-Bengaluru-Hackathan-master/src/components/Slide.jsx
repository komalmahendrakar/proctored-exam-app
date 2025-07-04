import React, { useState } from 'react';
import 'antd/dist/reset.css';
import { Button, Drawer, Avatar, Descriptions, Divider } from 'antd';
import { UserOutlined, MailOutlined, BookOutlined } from '@ant-design/icons';

const Slide = () => {
  const [open, setOpen] = useState(false);

  // Mock student data
  const student = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Student',
    avatar: 'https://joeschmoe.io/api/v1/random', // Random avatar URL
    course: 'Computer Science',
    semester: '4th Semester',
    enrollmentId: '123456789',
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showDrawer}
        style={{
          height: '60px',
          fontSize: '20px',
          padding: '10px 30px',
          position:'relative',
          top:'-280px',right:'-10px'
        }}
      >
        View Profile
      </Button>
      <Drawer
        title="Student Profile"
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
        width={350} // Adjust the width of the drawer
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Avatar
            size={100}
            src={student.avatar}
            icon={<UserOutlined />}
            style={{ marginBottom: '10px' }}
          />
          <h3>{student.name}</h3>
          <p style={{ color: '#666' }}>{student.role}</p>
        </div>

        <Divider />

        <Descriptions column={1}>
          <Descriptions.Item label={<span><MailOutlined /> Email</span>}>
            {student.email}
          </Descriptions.Item>
          <Descriptions.Item label={<span><BookOutlined /> Course</span>}>
            {student.course}
          </Descriptions.Item>
          <Descriptions.Item label="Semester">
            {student.semester}
          </Descriptions.Item>
          <Descriptions.Item label="Enrollment ID">
            {student.enrollmentId}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default Slide;