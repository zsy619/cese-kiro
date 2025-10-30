import React from 'react';
import { 
  Modal, 
  Form, 
  Select, 
  Switch, 
  Typography, 
  Space, 
  Divider,
  Button,
  message
} from 'antd';
import { 
  SettingOutlined,
  BulbOutlined,
  GlobalOutlined,
  FontSizeOutlined,
  SaveOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useUserPreferences } from '../../hooks';
import type { UserPreferences } from '../../hooks';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface UserPreferencesModalProps {
  open: boolean;
  onCancel: () => void;
}

const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
  open,
  onCancel
}) => {
  const [preferences, setPreferences] = useUserPreferences();
  const [form] = Form.useForm();

  // 处理保存
  const handleSave = (values: UserPreferences) => {
    setPreferences(values);
    message.success('偏好设置已保存');
    onCancel();
  };

  // 重置为默认设置
  const handleReset = () => {
    const defaultPrefs: UserPreferences = {
      theme: 'auto',
      language: 'zh-CN',
      fontSize: 'medium',
      autoSave: true,
      showTips: true
    };
    form.setFieldsValue(defaultPrefs);
  };

  return (
    <Modal
      title={
        <div className='flex items-center'>
          <SettingOutlined className='mr-2' />
          用户偏好设置
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={600}
      footer={
        <Space>
          <Button onClick={handleReset}>
            恢复默认
          </Button>
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button 
            type='primary' 
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
          >
            保存设置
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={preferences}
        onFinish={handleSave}
      >
        {/* 主题设置 */}
        <div className='mb-6'>
          <Title level={5} className='flex items-center !mb-3'>
            <BulbOutlined className='mr-2 text-yellow-500' />
            主题外观
          </Title>
          
          <Form.Item
            label='主题模式'
            name='theme'
            tooltip='选择应用的主题模式'
          >
            <Select>
              <Option value='light'>浅色主题</Option>
              <Option value='dark'>深色主题</Option>
              <Option value='auto'>跟随系统</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label='字体大小'
            name='fontSize'
            tooltip='调整界面字体大小'
          >
            <Select>
              <Option value='small'>小号字体</Option>
              <Option value='medium'>中号字体</Option>
              <Option value='large'>大号字体</Option>
            </Select>
          </Form.Item>
        </div>

        <Divider />

        {/* 语言设置 */}
        <div className='mb-6'>
          <Title level={5} className='flex items-center !mb-3'>
            <GlobalOutlined className='mr-2 text-blue-500' />
            语言设置
          </Title>
          
          <Form.Item
            label='界面语言'
            name='language'
            tooltip='选择应用界面语言'
          >
            <Select>
              <Option value='zh-CN'>简体中文</Option>
              <Option value='en-US'>English</Option>
            </Select>
          </Form.Item>
        </div>

        <Divider />

        {/* 功能设置 */}
        <div className='mb-6'>
          <Title level={5} className='flex items-center !mb-3'>
            <FontSizeOutlined className='mr-2 text-green-500' />
            功能设置
          </Title>
          
          <Form.Item
            label='自动保存'
            name='autoSave'
            valuePropName='checked'
            tooltip='开启后会自动保存表单内容到本地'
          >
            <Switch 
              checkedChildren='开启' 
              unCheckedChildren='关闭'
            />
          </Form.Item>

          <Form.Item
            label='显示操作提示'
            name='showTips'
            valuePropName='checked'
            tooltip='开启后会显示功能使用提示和帮助信息'
          >
            <Switch 
              checkedChildren='显示' 
              unCheckedChildren='隐藏'
            />
          </Form.Item>
        </div>

        <Divider />

        {/* 说明信息 */}
        <div className='bg-blue-50 p-4 rounded-lg'>
          <div className='flex items-start'>
            <QuestionCircleOutlined className='text-blue-500 mt-1 mr-2' />
            <div>
              <Text strong className='text-blue-800'>设置说明</Text>
              <Paragraph className='!mb-0 !mt-2 text-blue-700 text-sm'>
                • 所有设置会自动保存到本地浏览器中<br/>
                • 自动保存功能可以防止意外丢失编辑内容<br/>
                • 主题设置会立即生效，无需重启应用<br/>
                • 清除浏览器数据会重置所有偏好设置
              </Paragraph>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UserPreferencesModal;