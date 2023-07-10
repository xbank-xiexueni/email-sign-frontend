import {
  Button,
  Checkbox,
  Form,
  Input,
  Layout,
  Switch,
  Image,
  Divider,
  message,
} from 'antd';
import * as clipboard from 'clipboard-polyfill';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ImgSinnoFooter from './assets/sinno-footer.png';
import './App.less';
import {
  GREET_DATA,
  MINNOCOS_INITIAL_DATA,
  MINNOCOS_UR,
  PRIVACTY_DATA,
  SINNO_INITIAL_DATA,
  SINNO_URL,
} from './constant';

const { TextArea } = Input;

enum TAB_KEY {
  SINNO,
  MINNOCOS,
}

// 因为需要特殊的字体，所以需要加载字体文件
const getHTMLStr = (body: string) => {
  return `<html>
  <head>
    <style>
      <style> @font-face {
        font-family: AlibabaPuHuiTi-2-55-Regular;
        src: url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.eot)
            format('embedded-opentype'),
          url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.otf)
            format('opentype'),
          url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.ttf)
            format('TrueType'),
          url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.woff)
            format('woff'),
          url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.woff2)
            format('woff2');
      }
      * {
        margin: 0;
        padding: 0;
        font-family: AlibabaPuHuiTi-2-55-Regular, sans-serif;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
`;
};
const getImageUrl = (src: string) => {
  return `${window?.location?.origin}${src}`;
};
const { Sider, Content } = Layout;
const App = () => {
  const [dom, setDom] = useState<string>();
  // 因为需要特殊的字体，所以需要加载字体文件

  const [step, setStep] = useState(1);
  const [tabKey, setTabKey] = useState<TAB_KEY>(TAB_KEY.SINNO);
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [messageApi, contextHolder] = message.useMessage();
  const onFormChange = useCallback((value: any) => {
    setFormData((prev: any) => ({ ...prev, ...value }));
  }, []);

  const onCopy = useCallback(async () => {
    if (!dom) return;
    // const item = new clipboard.ClipboardItem({
    //   'text/html': new Blob([dom], { type: 'text/html' }),
    // });
    await clipboard.writeText(getHTMLStr(dom));
    messageApi.open({
      type: 'success',
      content: '复制成功!',
    });
    // await clipboard.write([item]);
  }, [dom, messageApi]);

  const initialData = useMemo(() => {
    if (tabKey === TAB_KEY.SINNO) {
      return SINNO_INITIAL_DATA[lang];
    }
    if (tabKey === TAB_KEY.MINNOCOS) {
      return MINNOCOS_INITIAL_DATA[lang];
    }
  }, [lang, tabKey]);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState<any>();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    form?.setFieldsValue(formData);
  }, [formData, form]);
  const isDisabled = useMemo(() => {
    if (!formData) return true;
    const {
      nameEn,
      nameZh1,
      nameZh2,
      profession,
      phone,
      tel1,
      tel2,
      email,
      address,
    } = formData;
    return (
      !nameEn &&
      !nameZh1 &&
      !nameZh2 &&
      !profession &&
      !phone &&
      !tel1 &&
      !tel2 &&
      !email &&
      !address
    );
  }, [formData]);

  const contentHeight = document.body.clientHeight >= 800 ? 800 : '100vh';
  const [step1Display, setStep1Display] = useState('flex');
  const [step2Display, setStep2Display] = useState('none');

  // 只允许输入数字并用空格隔开电话号码
  const phoneNoFormat = (e: any) => {
    const val = e.target.value; // 旧值
    let newVal = val.substring(0, 13).replace(/[^\d]/g, ''); // 提取中字符串中的数字（只数字）
    if (newVal.length > 7) {
      newVal = newVal.replace(/^(.{3})(.{4})(.*)$/, '$1 $2 $3');
    } else if (newVal.length > 3) {
      newVal = newVal.replace(/^(.{3})(.*)$/, '$1 $2');
    }
    return newVal;
  };

  const checkPhone = (_: any, value: any, callback: any) => {
    const reg = '^1[0-9]{10}$'; //手机号码验证regEx:第一位数字必须是1，11位数字
    const re = new RegExp(reg);
    // 去掉空格
    const trueVal = value.replace(/\s*/g, '');
    if (!trueVal) {
      callback('请输入您的手机号');
      return;
    }
    if (!re.test(trueVal)) {
      callback('请输入正确的电话号码');
      return;
    }
    callback();
  };

  const tel2NoFormat = (e: any) => {
    const val = e.target.value; // 旧值
    let newVal = val.substring(0, 9).replace(/[^\d]/g, ''); // 提取中字符串中的数字（只数字）
    if (newVal.length > 4) {
      newVal = newVal.replace(/^(.{4})(.*)$/, '$1 $2');
    }
    return newVal;
  };

  const tel1NoFormat = (e: any) => {
    const val = e.target.value; // 旧值
    let newVal = val.substring(0, 4).replace(/[^\d]/g, ''); // 提取中字符串中的数字（只数字）
    if (newVal.length > 0) {
      newVal = newVal.replace(/^(.{4})(.*)$/, '$1 $2');
    }
    return newVal;
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'gray',
      }}
      id='app'
    >
      {contextHolder}
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          background: 'white',
          height: contentHeight,
        }}
      >
        {/* 编辑 */}
        <Layout
          hasSider
          style={{
            transition: 'all 0.5s',
            opacity: step === 1 ? 1 : 0,
            display: step1Display,
          }}
        >
          <Sider
            width={'330px'}
            style={{
              background: 'white',
              height: contentHeight,
            }}
          >
            <div>
              {/* tab */}
              <div
                style={{
                  width: '100',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopWidth: '4px',
                    borderTopStyle: 'solid',
                    borderTopColor:
                      tabKey === TAB_KEY.SINNO ? '#C1F20D' : '#F8F8F8',
                    backgroundColor:
                      tabKey === TAB_KEY.SINNO ? 'white' : '#F8F8F8',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTabKey(TAB_KEY.SINNO)}
                >
                  <svg
                    width='21'
                    height='21'
                    viewBox='0 0 21 21'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M19.491 13.5393C20.5 10.6464 20.7611 7.54533 20.2425 4.5254C20.0978 3.57991 19.6533 2.70497 18.9759 2.0276C18.2986 1.35024 17.4236 0.905713 16.4782 0.761067C13.4582 0.242457 10.3536 0.499998 7.46069 1.50899C4.65596 2.46507 2.45452 4.66652 1.50197 7.47124C0.838711 9.38693 0.496499 11.4014 0.500027 13.4264C0.500027 14.386 0.612922 15.8255 0.799904 16.711C0.976301 17.5718 1.39966 18.3585 2.02058 18.9794C2.6415 19.6004 3.42823 20.0237 4.28905 20.2001C5.17457 20.3906 6.61398 20.5 7.57358 20.5C9.60216 20.5035 11.6131 20.1613 13.5288 19.4945C16.3335 18.542 18.535 16.3405 19.491 13.5393Z'
                      fill={tabKey === TAB_KEY.SINNO ? '#C1F20D' : '#737373'}
                    />
                    <path
                      d='M3.38936 15.5538C2.89192 15.5538 2.398 15.3704 2.271 15.3386L2.4227 14.5624C2.49679 14.6048 2.58498 14.633 2.66613 14.6612C2.98012 14.7671 3.30469 14.8094 3.63632 14.7706C3.73863 14.76 3.88327 14.7353 3.92914 14.626C3.98206 14.4954 3.68571 14.3931 3.55165 14.3508C3.15651 14.2343 2.59204 13.9662 2.54618 13.5676C2.51443 13.2853 2.59204 12.9855 2.93072 12.7914C3.13535 12.675 3.39641 12.6009 3.68924 12.5938C3.74568 12.5938 3.80566 12.5868 3.86563 12.5868C4.13729 12.5868 4.38424 12.6256 4.55711 12.6574C4.69118 12.6785 4.89933 12.7385 4.96636 12.7632L4.77585 13.4159C4.77585 13.4159 4.49008 13.2818 4.09848 13.2571C3.98911 13.25 3.87622 13.2536 3.76685 13.2677C3.65396 13.2818 3.44228 13.3241 3.48814 13.4864C3.53401 13.6487 3.76332 13.6805 3.89739 13.7228C4.0879 13.7863 4.2784 13.8569 4.45127 13.9592C4.49714 13.9874 4.53947 14.0156 4.58181 14.0474C4.70529 14.1391 4.81818 14.2767 4.84993 14.4319C4.87816 14.573 4.8711 14.7353 4.82524 14.8729C4.64178 15.4797 3.84799 15.5538 3.38936 15.5538Z'
                      fill='white'
                    />
                    <path
                      d='M15.6597 15.6314C15.2646 15.6314 14.9329 15.515 14.6684 15.2892C14.4038 15.0705 14.2591 14.7706 14.2274 14.4143C14.1885 13.8992 14.3261 13.4653 14.6366 13.1266C14.9718 12.7667 15.4092 12.5868 15.949 12.5868H15.9666C16.3441 12.5868 16.6793 12.7067 16.9509 12.9325C17.2085 13.1477 17.3531 13.4406 17.3813 13.8075C17.4202 14.3261 17.2826 14.7565 16.9721 15.1022C16.6546 15.455 16.2065 15.6314 15.6597 15.6314ZM15.889 13.3735C15.6385 13.3735 15.4339 13.4935 15.3069 13.7193C15.194 13.9133 15.1482 14.132 15.1693 14.3649C15.1764 14.4919 15.2364 14.6048 15.3281 14.7C15.4269 14.7988 15.5574 14.8482 15.7162 14.8482H15.7232C15.9666 14.8482 16.1783 14.7212 16.3053 14.4954C16.4323 14.2767 16.4852 14.0685 16.4606 13.8145C16.4182 13.5535 16.2453 13.3735 15.889 13.3735Z'
                      fill='white'
                    />
                    <path
                      d='M8.99892 15.4762L9.2353 13.9486C9.26705 13.7616 9.2353 13.617 9.16827 13.5358C9.10123 13.4582 8.99892 13.4229 8.85781 13.4159H8.84369C8.42739 13.4159 8.251 13.7299 8.17338 14.0015L7.93701 15.4762H7.04443L7.48896 12.7173H8.38153L8.35683 12.8796L8.39211 12.8479C8.57557 12.7138 8.87897 12.6292 9.16474 12.6292C9.67276 12.6292 10.0361 12.8691 10.142 13.2818C10.1808 13.4476 10.1878 13.6276 10.1561 13.8145L9.8915 15.4762H8.99892Z'
                      fill='white'
                    />
                    <path
                      d='M12.5834 15.4762L12.8197 13.9486C12.8515 13.7616 12.8268 13.6276 12.7527 13.5358C12.6927 13.4617 12.5869 13.4229 12.4423 13.4159H12.4246C12.0083 13.4159 11.8319 13.7299 11.7578 14.0015L11.5179 15.4762L10.6218 15.4692L11.0769 12.7138H11.9625L11.9307 12.8796L11.9766 12.8479C12.16 12.7138 12.4599 12.6292 12.7492 12.6292C13.2572 12.6292 13.6206 12.8691 13.7264 13.2818C13.7617 13.4476 13.7723 13.6276 13.7405 13.8145L13.4759 15.4762H12.5834Z'
                      fill='white'
                    />
                    <path
                      d='M5.38623 15.4761L5.8237 12.7173H6.7198L6.27528 15.4761H5.38623Z'
                      fill='white'
                    />
                    <path
                      d='M7.15375 11.7013C7.22784 11.4861 7.249 11.2567 7.2102 11.0345C7.19961 10.9639 7.16786 10.9004 7.11494 10.851C7.06555 10.8016 6.99852 10.7664 6.92796 10.7558C6.7057 10.717 6.47285 10.7381 6.26118 10.8122C6.05303 10.8828 5.89074 11.0451 5.82018 11.2532C5.77079 11.3943 5.74609 11.5425 5.74609 11.6942C5.74609 11.7648 5.75315 11.8706 5.76726 11.9376C5.78137 12.0011 5.81312 12.0611 5.85899 12.107C5.90485 12.1528 5.96483 12.1846 6.02833 12.1987C6.09536 12.2128 6.2012 12.2199 6.27176 12.2199C6.42346 12.2199 6.57164 12.1952 6.71275 12.1458C6.91738 12.0752 7.07966 11.9094 7.15375 11.7013Z'
                      fill='white'
                    />
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: '400' }}>
                    中研
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopStyle: 'solid',
                    borderTopWidth: '4px',
                    borderTopColor:
                      tabKey === TAB_KEY.MINNOCOS ? '#A30101' : '#F8F8F8',
                    backgroundColor:
                      tabKey === TAB_KEY.MINNOCOS ? 'white' : '#F8F8F8',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTabKey(TAB_KEY.MINNOCOS)}
                >
                  <svg
                    width='21'
                    height='21'
                    viewBox='0 0 21 21'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <rect
                      x='0.5'
                      y='0.5'
                      width='20'
                      height='20'
                      rx='2'
                      fill={tabKey === TAB_KEY.MINNOCOS ? '#A30101' : '#737373'}
                    />
                    <path
                      d='M10.6943 14.6578L5.7267 6H4.5V15.8913H4.98662V7.49028L9.63996 15.7291H10.7247L15.0401 7.49028V15.8913H16.5V6H15.3274L10.6943 14.6578Z'
                      fill='white'
                    />
                  </svg>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                    }}
                  >
                    明色
                  </span>
                </div>
              </div>
              {/* form */}
              <div
                style={{
                  padding: '24px 28px',
                }}
              >
                <Form
                  layout='horizontal'
                  // initialValues={}
                  onValuesChange={onFormChange}
                  form={form}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 24,
                    }}
                  >
                    <span
                      style={{ color: '#333', fontWeight: 400, fontSize: 16 }}
                    >
                      请输入您的签名信息
                    </span>
                    <Switch
                      size='small'
                      checkedChildren='EN'
                      unCheckedChildren='CN'
                      checked={lang === 'en'}
                      onChange={(value) => {
                        setLang(value ? 'en' : 'zh');
                      }}
                    />
                  </div>
                  {/* 英文名 */}
                  <Form.Item
                    name={'nameEn'}
                    style={{ marginBottom: '20px' }}
                    hidden={lang === 'zh'}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '请输入',
                    //     warningOnly: true,
                    //   },
                    // ]}
                  >
                    <Input placeholder='英文昵称' />
                  </Form.Item>
                  {/* 中文名 */}
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Form.Item
                      style={{
                        display: 'inline-block',
                        width: 'calc(28% - 8px)',
                        marginBottom: '20px',
                      }}
                      name={'nameZh1'}
                    >
                      <Input placeholder='姓' />
                    </Form.Item>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        lineHeight: '32px',
                        textAlign: 'center',
                      }}
                    />
                    <Form.Item
                      style={{
                        display: 'inline-block',
                        width: 'calc(72% - 8px)',
                        marginBottom: '20px',
                      }}
                      name={'nameZh2'}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: '请输入',
                      //     warningOnly: true,
                      //   },
                      // ]}
                    >
                      <Input placeholder='名' />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    name={'nameEn'}
                    style={{ marginBottom: '20px' }}
                    hidden={lang === 'en'}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '请输入',
                    //     warningOnly: true,
                    //   },
                    // ]}
                  >
                    <Input placeholder='英文昵称' />
                  </Form.Item>
                  {/* 职业 */}
                  <Form.Item
                    name={'profession'}
                    style={{ marginBottom: '20px' }}
                  >
                    <Input placeholder='部门职位' />
                  </Form.Item>
                  {/* 手机号 */}
                  <Form.Item
                    name={'phone'}
                    style={{ marginBottom: '20px' }}
                    getValueFromEvent={phoneNoFormat}
                    rules={[
                      {
                        validator: checkPhone,
                      },
                    ]}
                  >
                    <Input placeholder='手机号码' />
                  </Form.Item>
                  {/* 电话 */}
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Form.Item
                      style={{
                        display: 'inline-block',
                        width: 'calc(28% - 8px)',
                        marginBottom: '20px',
                      }}
                      rules={[
                        {
                          validator: (_, value, callback) => {
                            /\d{4}$/.test(value)
                              ? callback('请输入有效的区号')
                              : callback();
                          },
                        },
                      ]}
                      getValueFromEvent={tel1NoFormat}
                      name={'tel1'}
                    >
                      <Input placeholder='区号' />
                    </Form.Item>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        lineHeight: '32px',
                        textAlign: 'center',
                      }}
                    />
                    <Form.Item
                      style={{
                        display: 'inline-block',
                        width: 'calc(72% - 8px)',
                        marginBottom: '20px',
                      }}
                      rules={[
                        {
                          validator: (_, value, callback) => {
                            /\d{7,8}$/.test(value)
                              ? callback('请输入有效的固话号码')
                              : callback();
                          },
                        },
                      ]}
                      getValueFromEvent={tel2NoFormat}
                      name={'tel2'}
                    >
                      <Input placeholder='固话号码' />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    name={'email'}
                    style={{ marginBottom: '20px' }}
                    rules={[
                      {
                        type: 'email',
                        message: '无效输入',
                        warningOnly: true,
                      },
                    ]}
                  >
                    <Input placeholder='邮箱' />
                  </Form.Item>
                  <Form.Item name={'address'} style={{ marginBottom: '20px' }}>
                    <TextArea
                      style={{
                        borderColor: '#D9DFE4',
                        resize: 'none',
                      }}
                      placeholder='地址'
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                  </Form.Item>

                  <div className='checkbox'>
                    <Form.Item
                      name='privacy'
                      style={{ marginBottom: 0 }}
                      valuePropName='checked'
                    >
                      <Checkbox>保密声明</Checkbox>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                marginBottom: '24px',
                justifyContent: 'center',
              }}
            >
              <Image src={ImgSinnoFooter} height={'40px'} preview={false} />
            </div>
          </Sider>
          <Content
            style={{
              backgroundColor: '#eaeff5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            <div
              style={{
                width: '670px',
                boxShadow: '0px 2px 30px 0px rgba(0, 0, 0, 0.10)',
                borderRadius: 8,
                overflow: 'hidden',
                marginTop: '50px',
              }}
            >
              <div
                style={{
                  background: '#191A1D',
                  display: 'flex',
                  height: '44px',
                  alignItems: 'center',
                  padding: '16px',
                  gap: '8px',
                }}
              >
                {['#EC3A4A', '#F1B659', '#18B295'].map((color) => (
                  <div
                    key={color}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '100%',
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  padding: '24px',
                  backgroundColor: 'white',
                }}
              >
                {/* 问候 */}
                <div style={{ marginBottom: '32px', width: '500px' }}>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#B1B1B1',
                      marginBottom: 10,
                    }}
                  >
                    To: {GREET_DATA[lang].name}
                  </p>
                  <Divider style={{ color: '#D9DFE4', margin: 0 }} />
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#B1B1B1',
                      margin: '10px 0',
                    }}
                  >
                    {GREET_DATA[lang].object}
                  </p>
                  <Divider style={{ color: '#D9DFE4', margin: 0 }} />
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#B1B1B1',
                      marginBottom: 10,
                      marginTop: 20,
                    }}
                  >
                    Hi {GREET_DATA[lang].name}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#B1B1B1',
                      marginBottom: 10,
                    }}
                  >
                    {GREET_DATA[lang].content}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#B1B1B1',
                      marginBottom: '10px',
                    }}
                  >
                    {GREET_DATA[lang].end}
                  </p>
                </div>
                {/* 预览 */}
                <div className='preview'>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '426px',
                        padding: '12px',
                        flexWrap: 'nowrap',
                        alignItems:
                          tabKey === TAB_KEY.SINNO ? 'center' : 'stretch',
                      }}
                    >
                      {/* 左边 */}
                      <div
                        hidden={isDisabled}
                        style={{ width: '270px', whiteSpace: 'pre-line' }}
                      >
                        {lang === 'zh' && (
                          <div>
                            {formData?.nameZh1 && (
                              <span
                                style={{
                                  fontSize: '24px',
                                  fontWeight: 800,
                                  color: '#333',
                                  fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                                }}
                              >
                                {formData.nameZh1}
                              </span>
                            )}
                            {formData?.nameZh2 && (
                              <span
                                style={{
                                  fontSize: '24px',
                                  fontWeight: 800,
                                  fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                                }}
                              >
                                &nbsp;{formData.nameZh2}
                              </span>
                            )}
                            {formData?.nameEn && (
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 400,
                                  fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                                }}
                              >
                                &nbsp;{formData.nameEn}
                              </span>
                            )}
                          </div>
                        )}
                        {lang === 'en' && (
                          <div>
                            {formData?.nameEn && (
                              <span
                                style={{
                                  fontSize: '24px',
                                  fontWeight: 800,
                                  color: '#333',
                                  fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                                }}
                              >
                                {formData.nameEn}
                              </span>
                            )}

                            {formData?.nameZh1 && (
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 400,
                                  fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                                }}
                              >
                                &nbsp; &nbsp;{formData.nameZh1}
                              </span>
                            )}
                            {formData?.nameZh2 && (
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 400,
                                  fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                                }}
                              >
                                &nbsp;{formData.nameZh2}
                              </span>
                            )}
                          </div>
                        )}
                        {formData?.profession && (
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#737373',
                              fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                            }}
                          >
                            {formData.profession}
                          </div>
                        )}
                        <div style={{ marginTop: 24 }}>
                          {formData?.phone && (
                            <div
                              style={{
                                fontSize: '13px',
                                color: '#737373',
                                marginBottom: 4,
                                fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                              }}
                            >
                              <img
                                src={getImageUrl(
                                  tabKey === TAB_KEY.SINNO
                                    ? '/dot-sinno.png'
                                    : '/dot-minnocos.png'
                                )}
                                width={6}
                              />
                              <span>
                                &nbsp;+86{' '}
                                {formData?.phone?.replace(
                                  /^(.{3})(.*)(.{4})$/,
                                  '$1 $2 $3'
                                )}
                              </span>
                            </div>
                          )}
                          {formData?.tel1 && formData?.tel2 && (
                            <div
                              style={{
                                fontSize: '13px',
                                color: '#737373',
                                marginBottom: 4,
                                fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                              }}
                            >
                              <img
                                src={getImageUrl(
                                  tabKey === TAB_KEY.SINNO
                                    ? '/dot-sinno.png'
                                    : '/dot-minnocos.png'
                                )}
                                width={6}
                              />
                              <span>
                                &nbsp;+{formData?.tel1} {formData.tel2}
                              </span>
                            </div>
                          )}
                          {formData?.email && (
                            <div
                              style={{
                                fontSize: '13px',
                                color: '#737373',
                                fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                              }}
                            >
                              <a
                                href='mailto:'
                                style={{
                                  color: '#737373',
                                  textDecoration: 'none',
                                }}
                                target='_blank'
                              >
                                <img
                                  src={getImageUrl(
                                    tabKey === TAB_KEY.SINNO
                                      ? '/dot-sinno.png'
                                      : '/dot-minnocos.png'
                                  )}
                                  width={6}
                                />
                                <span>&nbsp;{formData?.email}</span>
                              </a>
                            </div>
                          )}
                          {formData?.address && (
                            <div
                              style={{
                                marginTop: '16px',
                                color: '#737373',
                                fontSize: '11px',
                                fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                                whiteSpace: 'break-spaces',
                                wordBreak: 'break-word',
                                width: lang === 'zh' ? '230px' : 'auto',
                              }}
                            >
                              {formData.address}
                              <div>
                                <a
                                  href={
                                    tabKey === TAB_KEY.SINNO
                                      ? SINNO_URL
                                      : MINNOCOS_UR
                                  }
                                  style={{
                                    color: '#737373',
                                    textDecoration: 'none',
                                    fontSize: '11px',
                                    opacity: 0.7,
                                    fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                                  }}
                                >
                                  <span>
                                    {(tabKey === TAB_KEY.SINNO
                                      ? SINNO_URL
                                      : MINNOCOS_UR
                                    ).replace('https://', '')}
                                  </span>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* 右边 logo */}
                      <div>
                        {tabKey === TAB_KEY.SINNO && lang === 'zh' && (
                          <img src={getImageUrl('/sinno-zh.png')} width={100} />
                        )}
                        {tabKey === TAB_KEY.SINNO && lang === 'en' && (
                          <img src={getImageUrl('/sinno-en.png')} width={100} />
                        )}
                        {tabKey === TAB_KEY.MINNOCOS && lang === 'zh' && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              height: '100%',
                              alignItems: 'center',
                            }}
                          >
                            <img
                              src={getImageUrl('/minnocos-zh.png')}
                              width={130}
                            />
                            <img
                              src={getImageUrl('/minnocos-footer-zh.png')}
                              width={82}
                            />
                          </div>
                        )}
                        {tabKey === TAB_KEY.MINNOCOS && lang === 'en' && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              height: '100%',
                              alignItems: 'center',
                            }}
                          >
                            <img
                              src={getImageUrl('/minnocos-en.png')}
                              width={130}
                            />
                            <img
                              src={getImageUrl('/minnocos-footer-en.png')}
                              width={82}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {formData?.privacy && (
                      <div
                        style={{
                          padding: 8,
                          marginTop: 16,
                          fontSize: '12px',
                          color: '#B3B3B3',
                          width: '442px',
                          whiteSpace: 'pre-line',
                          borderRadius: 4,
                          borderColor: 'rgba(217, 223, 228, 0.60)',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          height: '155px',
                          fontFamily: 'AlibabaPuHuiTi-2-55-Regular',
                        }}
                      >
                        <div
                          style={{
                            transform: 'scale(0.7)',
                            transformOrigin: 'left top',
                            width: '142%',
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>保密声明：</div>
                          {PRIVACTY_DATA['zh']}
                        </div>
                        <div
                          style={{
                            transform: 'scale(0.7)',
                            transformOrigin: 'left top',
                            width: '142%',
                            marginTop: '-10px',
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>
                            CONFIDENTIALITY NOTICE:
                          </div>
                          {PRIVACTY_DATA['en']}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                const mailDom = document.querySelector('.preview')?.innerHTML;
                setDom(mailDom);
                setStep(2);
                setTimeout(() => {
                  setStep1Display('none');
                  setStep2Display('block');
                }, 500);
              }}
              disabled={isDisabled}
            >
              生成签名
            </Button>
          </Content>
        </Layout>

        {/* 复制 */}
        <div
          style={{
            padding: '20px',
            color: '#333',
            transition: 'all 0.5s',
            opacity: step === 2 ? 1 : 0,
            display: step2Display,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setDom(undefined);
              setStep(1);
              setTimeout(() => {
                setStep1Display('flex');
                setStep2Display('none');
              }, 500);
            }}
          >
            <svg
              width='23'
              height='23'
              viewBox='0 0 23 23'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M17.5959 10.1871H7.25157L11.7709 5.66783C12.132 5.30665 12.132 4.71396 11.7709 4.35279C11.4097 3.99162 10.8262 3.99162 10.4651 4.35279L4.36219 10.4557C4.00102 10.8168 4.00102 11.4003 4.36219 11.7615L10.4651 17.8643C10.8262 18.2255 11.4097 18.2255 11.7709 17.8643C12.132 17.5032 12.132 16.9197 11.7709 16.5586L7.25157 12.0393H17.5959C18.1053 12.0393 18.522 11.6225 18.522 11.1132C18.522 10.6038 18.1053 10.1871 17.5959 10.1871Z'
                fill='#333333'
              />
            </svg>
            <span
              style={{
                fontSize: '14px',
              }}
            >
              返回编辑
            </span>
          </div>
          {/* 内容 */}
          <div style={{ marginTop: '46px', padding: '0 88px' }}>
            <p style={{ textAlign: 'center', fontSize: '30px' }}>
              ✅ 签名生成成功
            </p>
            <p
              style={{
                textAlign: 'center',
                color: '#737373',
                marginTop: 16,
                marginBottom: 72,
              }}
            >
              👇2步轻松配置使用
            </p>
            <p style={{ fontSize: '19px', marginBottom: 32 }}>
              1）点击下面按钮将签名复制粘贴板
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ width: 260 }} onClick={onCopy}>
                复制签名
              </Button>
            </div>
            <p style={{ fontSize: '19px', marginBottom: 28, marginTop: 64 }}>
              2）根据教程配置签名
            </p>
            <p style={{ fontSize: '15px', marginBottom: 12 }}>企业邮箱</p>
            <Divider
              style={{
                color: '#D9DFE4',
                marginBottom: 12,
              }}
            />
            <p
              style={{
                color: '#737373',
                fontSize: '15px',
                fontFamily: 'AlibabaPuHuiTi-2-45-Light',
              }}
            >
              1. 打开腾讯
              <a
                href='https://exmail.qq.com/'
                style={{
                  fontWeight: 500,
                  color: '#737373',
                  fontFamily: 'Alibaba-PuHuiTi-Regular',
                }}
                target='_blank'
              >
                企业邮箱️
              </a>
              在页面左上角，点击
              <span
                style={{
                  fontWeight: 500,
                  fontFamily: 'Alibaba-PuHuiTi-Regular',
                }}
              >
                {' '}
                设置{' '}
              </span>
              ；
            </p>
            <p
              style={{
                color: '#737373',
                fontSize: '15px',
                fontFamily: 'AlibabaPuHuiTi-2-45-Light',
              }}
            >
              2. 在设置界面中，在常规中下拉，找到个性签名，点击
              <span
                style={{
                  fontWeight: 500,
                  fontFamily: 'Alibaba-PuHuiTi-Regular',
                }}
              >
                {' '}
                添加个性签名；
              </span>
            </p>
            <p
              style={{
                color: '#737373',
                fontSize: '15px',
                fontFamily: 'AlibabaPuHuiTi-2-45-Light',
              }}
            >
              3. 在弹窗右上角，点击
              <span
                style={{
                  fontWeight: 500,
                  fontFamily: 'Alibaba-PuHuiTi-Regular',
                }}
              >
                {' '}
                HTML
              </span>
              , 进入源码编辑窗口；
            </p>
            <p
              style={{
                color: '#737373',
                fontSize: '15px',
                fontFamily: 'AlibabaPuHuiTi-2-45-Light',
              }}
            >
              4.
              删除内容编辑窗口内原有代码，让内容编辑窗口内空白，将您的签名粘帖到内容编辑窗口，并点击
              <span
                style={{
                  fontWeight: 500,
                  fontFamily: 'Alibaba-PuHuiTi-Regular',
                }}
              >
                {' '}
                保存按钮；
              </span>
            </p>
            <p
              style={{
                color: '#737373',
                fontSize: '15px',
                fontFamily: 'AlibabaPuHuiTi-2-45-Light',
              }}
            >
              5. 最后检查最终效果，如不满意请重新设置您的签名。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
