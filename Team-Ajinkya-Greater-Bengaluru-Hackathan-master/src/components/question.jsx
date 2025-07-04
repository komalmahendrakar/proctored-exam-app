import React, { useState } from 'react';
import { Card, Radio, Input, Checkbox, Button, Space } from 'antd';
import { CodeOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const tabList = [
  {
    key: 'Q1',
    tab: 'Question 1',
  },
  {
    key: 'Q2',
    tab: 'Question 2',
  },
  {
    key: 'Q3',
    tab: 'Question 3',
  },
];

const Question = () => {
  const [activeTabKey, setActiveTabKey] = useState('Q1'); // Initialize with the first question

  // Handle tab change
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  // Navigate to the previous question
  const handlePrevious = () => {
    const currentIndex = tabList.findIndex((tab) => tab.key === activeTabKey);
    if (currentIndex > 0) {
      setActiveTabKey(tabList[currentIndex - 1].key);
    }
  };

  // Navigate to the next question
  const handleNext = () => {
    const currentIndex = tabList.findIndex((tab) => tab.key === activeTabKey);
    if (currentIndex < tabList.length - 1) {
      setActiveTabKey(tabList[currentIndex + 1].key);
    }
  };

  // Define the content for each question
  const renderQuestionContent = (key) => {
    switch (key) {
      case 'Q1':
        return (
          <div>
            <p>What is the capital of France?</p>
            <Radio.Group>
              <Radio value="Paris">Paris</Radio>
              <Radio value="London">London</Radio>
              <Radio value="Berlin">Berlin</Radio>
              <Radio value="Madrid">Madrid</Radio>
            </Radio.Group>
          </div>
        );
      case 'Q2':
        return (
          <div>
            <p>Write a brief description of your favorite book:</p>
            <Input.TextArea rows={7} placeholder="Enter your answer here..." />
          </div>
        );
      case 'Q3':
        return (
          <div>
            <p>Write a Python function to reverse a string:</p>
            <Input.TextArea
              rows={10}
              placeholder="Write your code here..."
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      style={{
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CodeOutlined />
          <span>Quiz Questions</span>
        </div>
      }
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
      extra={
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handlePrevious}
            disabled={activeTabKey === 'Q1'} // Disable if on the first question
          >
            Previous
          </Button>
          <Button
            icon={<ArrowRightOutlined />}
            onClick={handleNext}
            disabled={activeTabKey === 'Q3'} // Disable if on the last question
          >
            Next
          </Button>
        </Space>
      }
    >
      {renderQuestionContent(activeTabKey)}
    </Card>
  );
};

export default Question;