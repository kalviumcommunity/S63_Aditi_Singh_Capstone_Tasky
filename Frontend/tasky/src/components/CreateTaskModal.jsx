import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber, Upload, Button, Space } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from '../api';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const CreateTaskModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [existingTasks, setExistingTasks] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchUsers();
      fetchTasks();
    }
  }, [visible]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users/managers', {
        withCredentials: true
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching manager users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks/all', {
        withCredentials: true
      });
      setExistingTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Prepare task data object
      const taskData = {
        title: values.title,
        description: values.description,
        assignedTo: values.assignedTo,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
        priority: values.priority,
        category: values.category,
        // Ensure tags and dependencies are arrays before stringifying
        tags: Array.isArray(values.tags) ? values.tags : [],
        estimatedHours: values.estimatedHours,
        dependencies: Array.isArray(values.dependencies) ? values.dependencies : [],
      };

      // Append task data as a JSON string
      formData.append('task', JSON.stringify(taskData));

      // Append files
      fileList.forEach(file => {
        formData.append('attachments', file.originFileObj);
      });

      const response = await axios.post('/tasks/create', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSuccess(response.data);
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Task"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter task title' }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter task description' }]}
        >
          <TextArea rows={4} placeholder="Enter task description" />
        </Form.Item>

        <Form.Item
          name="assignedTo"
          label="Assign To"
          rules={[{ required: true, message: 'Please select assignee' }]}
        >
          <Select placeholder="Select manager to assign task">
            {users.map(user => (
              <Option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select due date' }]}
        >
          <DatePicker 
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select priority' }]}
        >
          <Select placeholder="Select priority">
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
            <Option value="urgent">Urgent</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select placeholder="Select category">
            <Option value="development">Development</Option>
            <Option value="design">Design</Option>
            <Option value="testing">Testing</Option>
            <Option value="documentation">Documentation</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
        >
          <Select
            mode="tags"
            placeholder="Enter tags"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="estimatedHours"
          label="Estimated Hours"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="dependencies"
          label="Dependencies"
        >
          <Select
            mode="multiple"
            placeholder="Select dependent tasks"
            style={{ width: '100%' }}
          >
            {existingTasks.map(task => (
              <Option key={task._id} value={task._id}>{task.title}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Attachments"
        >
          <Upload
            multiple
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Upload Files</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Task
            </Button>
            <Button onClick={onClose}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal; 