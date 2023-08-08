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
  VISION_INITIAL_DATA,
} from './constant';

const { TextArea } = Input;

enum TAB_KEY {
  SINNO,
  MINNOCOS,
  VISION,
}

// 因为需要特殊的字体，所以需要加载字体文件
const getHTMLStr = (body: string) => {
  return `<html><head><style>@font-face {font-family: AliPuHuiTi-2;src: url(https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-55-Regular/AlibabaPuHuiTi-2-55-Regular.ttf) format('TrueType');}* {margin: 0;padding: 0;font-family: AliPuHuiTi-2, sans-serif;}</style></head><body>${body}</body></html>`;
};
const getImageUrl = (src: string) => {
  return `${
    import.meta.env.VITE_IMAGE_PREFIX ||
    'https://email-sign-frontend.pages.dev/'
    // window.location.origin
  }${src}`;
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
    console.log(dom);
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
    if (tabKey === TAB_KEY.VISION) {
      return VISION_INITIAL_DATA[lang];
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
      newVal = newVal.replace(/^(.{4})(.*)$/, '$1');
    }
    return newVal;
  };

  const flag = useMemo(() => {
    // if (tabKey !== TAB_KEY.SINNO) return 4;
    let pos = '';
    let i = 0;
    if (tabKey === TAB_KEY.SINNO) i = 2;
    if (!!formData?.nameEn || !!formData?.nameZh1 || !!formData?.nameZh2) {
      i++;
      pos = 'name';
    }
    if (!!formData?.profession) {
      i++;
      pos = 'profession';
    }
    if (!!formData?.phone) {
      i++;
      pos = 'phone';
    }
    if (!!formData?.tel1 || !!formData?.tel2) {
      i++;
      pos = 'tel';
    }
    if (!!formData?.email) {
      i++;
      pos = 'email';
    }
    if (!!formData?.address) {
      i++;
      pos = 'address';
    }

    return {
      rowSpan: i,
      pos,
    };
  }, [formData, tabKey]);

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
          minHeight: contentHeight,
        }}
      >
        {/* 编辑 */}
        <Layout
          hasSider
          style={{
            transition: 'all 0.3s',
            opacity: step === 1 ? 1 : 0,
            display: step1Display,
            // ?
            alignItems: 'stretch',
          }}
        >
          <Sider
            width={'330px'}
            style={{
              background: 'white',
              minHeight: contentHeight,
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
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      marginTop: 4,
                    }}
                  >
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
                      marginTop: 4,
                    }}
                  >
                    明色
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
                      tabKey === TAB_KEY.VISION ? '#C1F20D' : '#F8F8F8',
                    backgroundColor:
                      tabKey === TAB_KEY.VISION ? 'white' : '#F8F8F8',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTabKey(TAB_KEY.VISION)}
                >
                  <svg
                    width='20'
                    height='21'
                    viewBox='0 0 20 21'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g clip-path='url(#clip0_1_733)'>
                      <path
                        d='M7.10927 19.8243C5.18734 18.8662 3.21566 17.2162 1.7467 15.4075C-0.591861 12.5282 -0.581278 8.41866 1.77175 5.55128C3.24988 3.75 5.22967 2.10994 7.15654 1.16168C8.95782 0.274795 11.0932 0.280087 12.8902 1.17579C14.8122 2.13393 16.7838 3.78387 18.2531 5.59256C20.5917 8.47193 20.5815 12.5818 18.2281 15.4492C16.75 17.2504 14.7698 18.8909 12.843 19.8391C11.0417 20.7253 8.90631 20.72 7.10927 19.8243Z'
                        fill={tabKey === TAB_KEY.VISION ? '#C1F20D' : '#737373'}
                      />
                      <path
                        d='M3.2706 9.45774C3.25261 9.44892 3.23285 9.44434 3.2131 9.44434C3.19334 9.44434 3.17358 9.44892 3.15559 9.45774C3.11714 9.47679 3.07728 9.50995 3.04764 9.54594C3.00072 9.60344 3.00072 9.68599 3.04764 9.74349C3.07728 9.77983 3.11679 9.81264 3.15559 9.83169C3.17358 9.8405 3.19334 9.84509 3.2131 9.84509C3.23285 9.84509 3.25261 9.8405 3.2706 9.83169C3.30905 9.81264 3.34891 9.77947 3.37855 9.74349C3.42547 9.68599 3.42547 9.60344 3.37855 9.54594C3.34891 9.5096 3.3094 9.47679 3.2706 9.45774Z'
                        fill='white'
                      />
                      <path
                        d='M3.37855 9.74367C3.34891 9.78001 3.3094 9.81282 3.2706 9.83187C3.25261 9.84069 3.23285 9.84527 3.2131 9.84527C3.19334 9.84527 3.17358 9.84069 3.15559 9.83187C3.11714 9.81282 3.07728 9.77966 3.04764 9.74367C3.00072 9.68617 3.00072 9.60362 3.04764 9.54612C3.07728 9.50978 3.11679 9.47697 3.15559 9.45792C3.17358 9.4491 3.19334 9.44452 3.2131 9.44452C3.23285 9.44452 3.25261 9.4491 3.2706 9.45792C3.30905 9.47697 3.34891 9.51014 3.37855 9.54612C3.42547 9.60327 3.42547 9.68582 3.37855 9.74367Z'
                        fill='white'
                      />
                      <path
                        d='M3.35033 10.1763H3.07622V11.5077H3.35033V10.1763Z'
                        fill='white'
                      />
                      <path
                        d='M14.8734 9.74386C14.8438 9.78019 14.8043 9.813 14.7655 9.83205C14.7475 9.84087 14.7277 9.84546 14.708 9.84546C14.6882 9.84546 14.6685 9.84087 14.6505 9.83205C14.612 9.813 14.5722 9.77984 14.5425 9.74386C14.4956 9.68635 14.4956 9.6038 14.5425 9.5463C14.5722 9.50997 14.6117 9.47716 14.6505 9.45811C14.6685 9.44929 14.6882 9.4447 14.708 9.4447C14.7277 9.4447 14.7475 9.44929 14.7655 9.45811C14.8039 9.47716 14.8438 9.51032 14.8734 9.5463C14.9207 9.60345 14.9207 9.686 14.8734 9.74386Z'
                        fill='white'
                      />
                      <path
                        d='M14.8452 10.1764H14.5711V11.5078H14.8452V10.1764Z'
                        fill='white'
                      />
                      <path
                        d='M18.3822 11.5127C18.3822 11.5127 18.3822 10.8237 18.3822 10.8226C18.3822 10.7217 18.3889 10.6067 18.3363 10.5161C18.2284 10.3294 17.9038 10.3457 17.7779 10.5041C17.7002 10.6014 17.7006 10.7284 17.7006 10.8406V11.5123H17.424V10.1844C17.43 10.1862 17.4364 10.188 17.4424 10.1897C17.4921 10.2035 17.5443 10.2105 17.5965 10.2105C17.672 10.2105 17.7443 10.1908 17.8167 10.1672C17.8816 10.1456 17.949 10.1305 18.017 10.1216C18.1768 10.1012 18.3391 10.1167 18.4721 10.2144C18.5931 10.3033 18.6545 10.4674 18.6545 10.702V11.5123H18.3822V11.5127Z'
                        fill='white'
                      />
                      <path
                        d='M6.96629 11.5127C6.96629 11.5127 6.96629 10.8237 6.96629 10.8226C6.96629 10.7217 6.97299 10.6067 6.92043 10.5161C6.81248 10.3294 6.48793 10.3457 6.36198 10.5041C6.28437 10.6014 6.28473 10.7284 6.28473 10.8406V11.5123H6.00815V10.1844C6.01415 10.1862 6.0205 10.188 6.02649 10.1897C6.07623 10.2035 6.12845 10.2105 6.18066 10.2105C6.25615 10.2105 6.32847 10.1908 6.40079 10.1672C6.4657 10.1456 6.53308 10.1305 6.60117 10.1216C6.76097 10.1012 6.92325 10.1167 7.05625 10.2144C7.17725 10.3033 7.23864 10.4674 7.23864 10.702V11.5123H6.96629V11.5127Z'
                        fill='white'
                      />
                      <path
                        d='M12.9667 11.1479C13.0937 11.2724 13.3286 11.3768 13.5082 11.272C13.5593 11.2421 13.5823 11.1835 13.5802 11.1285C13.5756 11.0121 13.4655 10.9729 13.3664 10.9404C13.2468 10.9009 13.1131 10.8752 13.0094 10.8C12.9085 10.727 12.8474 10.6088 12.8587 10.4843C12.8841 10.201 13.1547 10.0842 13.3911 10.0952C13.5636 10.1033 13.7142 10.1446 13.8744 10.2635C13.8405 10.3065 13.758 10.4236 13.7241 10.4667C13.6994 10.4458 13.6281 10.4007 13.5787 10.3799C13.4913 10.3432 13.4062 10.3248 13.3117 10.3442C13.2397 10.3591 13.1611 10.4081 13.1572 10.4857C13.1526 10.5873 13.2224 10.6339 13.2969 10.6617C13.4493 10.7185 13.6218 10.7418 13.7509 10.8466C13.8585 10.9337 13.9054 11.0748 13.8804 11.2085C13.8363 11.4431 13.601 11.568 13.3636 11.5645C13.1515 11.5613 12.9617 11.5098 12.7906 11.35C12.8041 11.3338 12.9649 11.15 12.9667 11.1479Z'
                        fill='white'
                      />
                      <path
                        d='M1.52118 11.1479C1.64818 11.2724 1.88313 11.3768 2.06269 11.272C2.11384 11.2421 2.13677 11.1835 2.13466 11.1285C2.13007 11.0121 2.02 10.9729 1.92087 10.9404C1.80128 10.9009 1.66758 10.8752 1.56386 10.8C1.46297 10.727 1.40194 10.6088 1.41323 10.4843C1.43863 10.201 1.70921 10.0842 1.94557 10.0952C2.11808 10.1033 2.26871 10.1446 2.42887 10.2635C2.39501 10.3065 2.31246 10.4236 2.27859 10.4667C2.25389 10.4458 2.18263 10.4007 2.13324 10.3799C2.04576 10.3432 1.96074 10.3248 1.86619 10.3442C1.79423 10.3591 1.71556 10.4081 1.71168 10.4857C1.70709 10.5873 1.77694 10.6339 1.85138 10.6617C2.00378 10.7185 2.17628 10.7418 2.3054 10.8466C2.413 10.9337 2.45992 11.0748 2.43487 11.2085C2.39077 11.4431 2.15547 11.568 1.91805 11.5645C1.70603 11.5613 1.51624 11.5098 1.34514 11.35C1.3589 11.3338 1.51941 11.15 1.52118 11.1479Z'
                        fill='white'
                      />
                      <path
                        d='M9.71337 10.1763H10.0489L10.4665 11.0329L10.8825 10.1763H11.2194L10.4634 11.5677L9.71337 10.1763Z'
                        fill='white'
                      />
                      <path
                        d='M5.03695 11.5127C5.03695 11.5127 5.03695 10.8237 5.03695 10.8226C5.03695 10.7217 5.04366 10.6067 4.99109 10.5161C4.88314 10.3294 4.55859 10.3457 4.43265 10.5041C4.35504 10.6014 4.35539 10.7284 4.35539 10.8406V11.5123H4.07881V10.1844C4.08481 10.1862 4.09116 10.188 4.09716 10.1897C4.1469 10.2035 4.19911 10.2105 4.25132 10.2105C4.32681 10.2105 4.39913 10.1908 4.47145 10.1672C4.53636 10.1456 4.60374 10.1305 4.67183 10.1216C4.83164 10.1012 4.99392 10.1167 5.12691 10.2144C5.24792 10.3033 5.3093 10.4674 5.3093 10.702V11.5123H5.03695V11.5127Z'
                        fill='white'
                      />
                      <path
                        d='M8.59083 11.5772C8.18867 11.5772 7.86164 11.2449 7.86164 10.8367C7.86164 10.4286 8.18867 10.0963 8.59083 10.0963C8.993 10.0963 9.32002 10.4286 9.32002 10.8367C9.32002 11.2449 8.993 11.5772 8.59083 11.5772ZM8.59083 10.3845C8.34883 10.3845 8.15198 10.5873 8.15198 10.8371C8.15198 11.0865 8.34883 11.2897 8.59083 11.2897C8.83284 11.2897 9.02969 11.0869 9.02969 10.8371C9.02969 10.5873 8.83284 10.3845 8.59083 10.3845Z'
                        fill='white'
                      />
                      <path
                        d='M16.1364 11.5772C15.7342 11.5772 15.4072 11.2449 15.4072 10.8367C15.4072 10.4286 15.7342 10.0963 16.1364 10.0963C16.5385 10.0963 16.8656 10.4286 16.8656 10.8367C16.8656 11.2449 16.5385 11.5772 16.1364 11.5772ZM16.1364 10.3845C15.8944 10.3845 15.6975 10.5873 15.6975 10.8371C15.6975 11.0865 15.8944 11.2897 16.1364 11.2897C16.3784 11.2897 16.5752 11.0869 16.5752 10.8371C16.5752 10.5873 16.3784 10.3845 16.1364 10.3845Z'
                        fill='white'
                      />
                      <path
                        d='M12.037 9.45774C12.019 9.44892 11.9992 9.44434 11.9795 9.44434C11.9597 9.44434 11.94 9.44892 11.922 9.45774C11.8835 9.47679 11.8436 9.50995 11.814 9.54594C11.7671 9.60344 11.7671 9.68599 11.814 9.74349C11.8436 9.77983 11.8832 9.81264 11.922 9.83169C11.94 9.8405 11.9597 9.84509 11.9795 9.84509C11.9992 9.84509 12.019 9.8405 12.037 9.83169C12.0754 9.81264 12.1153 9.77947 12.1449 9.74349C12.1918 9.68599 12.1918 9.60344 12.1449 9.54594C12.1153 9.5096 12.0754 9.47679 12.037 9.45774Z'
                        fill='white'
                      />
                      <path
                        d='M12.1447 9.74367C12.1151 9.78001 12.0756 9.81282 12.0368 9.83187C12.0188 9.84069 11.999 9.84527 11.9793 9.84527C11.9595 9.84527 11.9397 9.84069 11.9218 9.83187C11.8833 9.81282 11.8434 9.77966 11.8138 9.74367C11.7669 9.68617 11.7669 9.60362 11.8138 9.54612C11.8434 9.50978 11.8829 9.47697 11.9218 9.45792C11.9397 9.4491 11.9595 9.44452 11.9793 9.44452C11.999 9.44452 12.0188 9.4491 12.0368 9.45792C12.0752 9.47697 12.1151 9.51014 12.1447 9.54612C12.192 9.60327 12.192 9.68582 12.1447 9.74367Z'
                        fill='white'
                      />
                      <path
                        d='M12.1168 10.1763H11.8427V11.5077H12.1168V10.1763Z'
                        fill='white'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_1_733'>
                        <rect
                          width='20'
                          height='20'
                          fill='white'
                          transform='translate(0 0.5)'
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      marginTop: 4,
                    }}
                  >
                    心研
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
                        width: '72%',
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
                        warningOnly: true,
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
                            !/\d{3,4}$/.test(value)
                              ? callback('无效输入')
                              : callback();
                          },
                          warningOnly: true,
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
                        width: '72%',
                        marginBottom: '20px',
                      }}
                      rules={[
                        {
                          validator: (_, value, callback) => {
                            const v = value.replace(/\s*/g, '');
                            !/^(\d{7}|\d{8})$/.test(v)
                              ? callback('无效输入')
                              : callback();
                          },
                          warningOnly: true,
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
              <Image
                src={ImgSinnoFooter}
                height={'40px'}
                preview={false}
                width={'113px'}
              />
            </div>
          </Sider>
          <Content
            style={{
              backgroundColor: '#eaeff5',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
              justifyContent: 'space-around',
              padding: '10px 0',
            }}
          >
            <div>
              <div
                style={{
                  width: '670px',
                  boxShadow: '0px 2px 30px 0px rgba(0, 0, 0, 0.10)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  // marginTop: '50px',
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
                  <div style={{ marginBottom: '32px' }}>
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
                        width: '500px',
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
                        width: '500px',
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
                    <table
                      style={{
                        padding: '12px',
                        borderSpacing: 0,
                      }}
                    >
                      <tbody>
                        <tr>
                          <td>
                            {lang === 'zh' && (
                              <>
                                {formData?.nameZh1 && (
                                  <span
                                    style={{
                                      fontSize: '24px',
                                      fontWeight: 800,
                                      color: '#333',
                                      fontFamily: 'AliPuHuiTi-2',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {formData.nameZh1}&nbsp;
                                  </span>
                                )}
                                {formData?.nameZh2 && (
                                  <span
                                    style={{
                                      fontSize: '24px',
                                      fontWeight: 800,
                                      color: '#333',
                                      fontFamily: 'AliPuHuiTi-2',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {formData.nameZh2}
                                  </span>
                                )}
                                {formData?.nameEn && (
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: 400,
                                      fontFamily: 'AliPuHuiTi-2',
                                      color: '#333',
                                      lineHeight: 1,
                                    }}
                                  >
                                    &nbsp;{formData.nameEn}
                                  </span>
                                )}
                              </>
                            )}
                            {lang === 'en' && (
                              <>
                                {formData?.nameEn && (
                                  <span
                                    style={{
                                      fontSize: '24px',
                                      fontWeight: 800,
                                      color: '#333',
                                      fontFamily: 'AliPuHuiTi-2',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {formData.nameEn}&nbsp;
                                  </span>
                                )}

                                {formData?.nameZh1 && (
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: 400,
                                      color: '#333',
                                      fontFamily: 'AliPuHuiTi-2',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {formData.nameZh1}&nbsp;
                                  </span>
                                )}
                                {formData?.nameZh2 && (
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: 400,
                                      color: '#333',
                                      fontFamily: 'AliPuHuiTi-2',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {formData.nameZh2}
                                  </span>
                                )}
                              </>
                            )}
                          </td>
                          {tabKey === TAB_KEY.SINNO && lang === 'zh' && (
                            <td
                              rowSpan={flag.rowSpan}
                              style={{ width: '210px', textAlign: 'center' }}
                            >
                              <img
                                src={getImageUrl('/sinno-zh.png')}
                                width={100}
                                height={100}
                              />
                            </td>
                          )}
                          {tabKey === TAB_KEY.SINNO && lang === 'en' && (
                            <td
                              rowSpan={flag.rowSpan}
                              style={{ width: '210px', textAlign: 'center' }}
                            >
                              <img
                                src={getImageUrl('/sinno-en.png')}
                                width={100}
                                height={100}
                              />
                            </td>
                          )}

                          {tabKey === TAB_KEY.MINNOCOS && lang === 'zh' && (
                            <td
                              style={{
                                height: '100%',
                                width: '210px',
                                textAlign: 'center',
                                verticalAlign: 'top',
                                paddingTop: 10,
                              }}
                              align='right'
                              rowSpan={flag.rowSpan}
                            >
                              <img
                                src={getImageUrl('/minnocos-zh.png')}
                                width={130}
                                height={40}
                              />
                            </td>
                          )}
                          {tabKey === TAB_KEY.MINNOCOS && lang === 'en' && (
                            <td
                              style={{
                                height: '100%',
                                width: '210px',
                                textAlign: 'center',
                                verticalAlign: 'top',
                                paddingTop: 10,
                              }}
                              align='right'
                              rowSpan={flag.rowSpan}
                            >
                              <img
                                src={getImageUrl('/minnocos-en.png')}
                                width={130}
                                height={28}
                              />
                            </td>
                          )}

                          {tabKey === TAB_KEY.VISION && lang === 'zh' && (
                            <td
                              style={{
                                height: '100%',
                                width: '190px',
                                textAlign: 'center',
                                verticalAlign: 'top',
                                paddingTop: 10,
                              }}
                              align='right'
                              rowSpan={flag.rowSpan}
                            >
                              <div>
                                <img
                                  src={getImageUrl('/vision-zh.png')}
                                  width={98}
                                  height={98}
                                />
                              </div>
                            </td>
                          )}
                          {tabKey === TAB_KEY.VISION && lang === 'en' && (
                            <td
                              rowSpan={flag.rowSpan}
                              style={{
                                height: '100%',
                                width: '190px',
                                textAlign: 'center',
                                verticalAlign: 'top',
                                paddingTop: 10,
                              }}
                              align='right'
                            >
                              <img
                                src={getImageUrl('/vision-en.png')}
                                width={98}
                                height={98}
                              />
                            </td>
                          )}
                        </tr>

                        {/* 2 */}
                        {formData?.profession && (
                          <tr>
                            <td>
                              <span
                                style={{
                                  fontSize: '14px',
                                  color: '#737373',
                                  fontFamily: 'AliPuHuiTi-2',
                                }}
                              >
                                {formData.profession}
                              </span>
                            </td>
                            {tabKey !== TAB_KEY.SINNO &&
                              flag.pos === 'profession' && (
                                <td align='center'>
                                  <img
                                    src={getImageUrl('/minnocos-footer-zh.png')}
                                    width={82}
                                    height={18}
                                  />
                                </td>
                              )}
                          </tr>
                        )}

                        <tr>
                          <td style={{ height: '24px' }}></td>
                        </tr>

                        {formData?.phone && (
                          <tr
                            style={{
                              fontSize: '13px',
                              color: '#737373',
                              marginBottom: 4,
                              fontFamily: 'AliPuHuiTi-2',
                              width: '270px',
                            }}
                          >
                            <td>
                              <img
                                src={getImageUrl(
                                  tabKey === TAB_KEY.MINNOCOS
                                    ? '/dot-minnocos.png'
                                    : '/dot-sinno.png'
                                )}
                                width={6}
                              />
                              <span
                                style={{
                                  lineHeight: 1,
                                }}
                              >
                                &nbsp;+86{' '}
                                {formData?.phone?.replace(
                                  /^(.{3})(.*)(.{4})$/,
                                  '$1 $2 $3'
                                )}
                              </span>
                            </td>
                            {tabKey !== TAB_KEY.SINNO &&
                              flag.pos === 'phone' && (
                                <td align='center'>
                                  <img
                                    src={getImageUrl('/minnocos-footer-zh.png')}
                                    width={82}
                                    height={18}
                                  />
                                </td>
                              )}
                          </tr>
                        )}
                        {formData?.tel1 && formData?.tel2 && (
                          <tr
                            style={{
                              fontSize: '13px',
                              color: '#737373',
                              marginBottom: 4,
                              fontFamily: 'AliPuHuiTi-2',
                              width: '270px',
                            }}
                          >
                            <td>
                              <img
                                src={getImageUrl(
                                  tabKey === TAB_KEY.MINNOCOS
                                    ? '/dot-minnocos.png'
                                    : '/dot-sinno.png'
                                )}
                                width={6}
                              />
                              <span
                                style={{
                                  lineHeight: 1,
                                }}
                              >
                                &nbsp;+{formData?.tel1} {formData.tel2}
                              </span>
                            </td>
                            {tabKey !== TAB_KEY.SINNO && flag.pos === 'tel' && (
                              <td align='center'>
                                <img
                                  src={getImageUrl('/minnocos-footer-zh.png')}
                                  width={82}
                                  height={18}
                                />
                              </td>
                            )}
                          </tr>
                        )}
                        {formData?.email && (
                          <tr
                            style={{
                              fontSize: '13px',
                              color: '#737373',
                              fontFamily: 'AliPuHuiTi-2',
                              width: '270px',
                            }}
                          >
                            <td>
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
                                    tabKey === TAB_KEY.MINNOCOS
                                      ? '/dot-minnocos.png'
                                      : '/dot-sinno.png'
                                  )}
                                  width={6}
                                />
                                <span
                                  style={{
                                    lineHeight: 1,
                                  }}
                                >
                                  &nbsp;{formData?.email}
                                </span>
                              </a>
                            </td>
                            {tabKey !== TAB_KEY.SINNO &&
                              flag.pos === 'email' && (
                                <td align='center'>
                                  <img
                                    src={getImageUrl('/minnocos-footer-zh.png')}
                                    width={82}
                                    height={18}
                                  />
                                </td>
                              )}
                          </tr>
                        )}
                        <tr>
                          <td style={{ height: '16px' }}></td>
                        </tr>
                        {formData?.address && (
                          <tr
                            style={{
                              color: '#737373',
                            }}
                          >
                            <td
                              style={{
                                width:
                                  tabKey === TAB_KEY.VISION ? '200px' : '250px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontFamily: 'AliPuHuiTi-2',
                                  whiteSpace: 'break-spaces',
                                  wordBreak: 'break-word',
                                  transform: 'scale(0.916666)',
                                  transformOrigin: 'left top',
                                  lineHeight: 1,
                                }}
                              >
                                {formData.address}
                              </span>
                              <div>
                                <a
                                  href={
                                    tabKey === TAB_KEY.MINNOCOS
                                      ? MINNOCOS_UR
                                      : SINNO_URL
                                  }
                                  style={{
                                    color: '#737373',
                                    textDecoration: 'none',
                                    opacity: 0.7,
                                    fontFamily: 'AliPuHuiTi-2',
                                    lineHeight: 1,
                                  }}
                                  target='_blank'
                                >
                                  <span
                                    style={{
                                      fontSize: '12px',
                                      transform: 'scale(0.91666)',
                                      transformOrigin: 'left top',
                                    }}
                                  >
                                    {(tabKey === TAB_KEY.MINNOCOS
                                      ? MINNOCOS_UR
                                      : SINNO_URL
                                    ).replace('https://', '')}
                                  </span>
                                </a>
                              </div>
                            </td>
                            {tabKey !== TAB_KEY.SINNO &&
                              flag.pos === 'address' && (
                                <td align='center'>
                                  <img
                                    src={getImageUrl('/minnocos-footer-zh.png')}
                                    width={82}
                                    height={18}
                                  />
                                </td>
                              )}
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {formData?.privacy && (
                      <table style={{ marginTop: '-4px' }}>
                        <tr>
                          <td
                            style={{
                              textAlign: 'initial',
                              width:
                                tabKey === TAB_KEY.VISION ? '390px' : '460px',
                              padding: 8,
                              marginTop: 16,
                              fontSize: '12px',
                              color: '#B3B3B3',
                              whiteSpace: 'pre-line',
                              borderRadius: 4,
                              borderColor: 'rgba(217, 223, 228, 0.60)',
                              borderWidth: 1,
                              borderStyle: 'solid',
                              // height: '70%',
                            }}
                          >
                            <div
                              style={{
                                // transform: 'scale(0.7)',
                                transformOrigin: 'left top',
                                // width: '142%',
                                zoom: 0.7,
                                fontFamily: 'AliPuHuiTi-2',
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>保密声明：</div>
                              {PRIVACTY_DATA['zh']}
                            </div>
                            <div
                              style={{
                                // transform: 'scale(0.7)',
                                transformOrigin: 'left top',
                                // width: '142%',
                                marginTop: '10px',
                                zoom: 0.7,
                                fontFamily: 'AliPuHuiTi-2',
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>
                                CONFIDENTIALITY NOTICE:
                              </div>
                              {PRIVACTY_DATA['en']}
                            </div>
                          </td>
                        </tr>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: '#eaeff5',
                  marginTop: 32,
                }}
              >
                <Button
                  onClick={() => {
                    const mailDom =
                      document.querySelector('.preview')?.innerHTML;
                    setDom(mailDom);
                    setStep(2);
                    setTimeout(() => {
                      setStep1Display('none');
                      setStep2Display('block');
                    }, 300);
                  }}
                  disabled={isDisabled}
                >
                  生成签名
                </Button>
              </div>
            </div>
          </Content>
        </Layout>

        {/* 复制 */}
        <div
          style={{
            padding: '20px',
            color: '#333',
            transition: 'all 0.3s',
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
              }, 300);
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
            <p
              style={{
                textAlign: 'center',
                fontSize: '30px',
                fontFamily: 'Alibaba-PuHuiTi-Medium',
              }}
            >
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
            <p
              style={{
                fontSize: '19px',
                marginBottom: 32,
                fontFamily: 'Alibaba-PuHuiTi-Medium',
              }}
            >
              1）点击下面按钮将签名复制粘贴板
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ width: 260 }} onClick={onCopy}>
                复制签名
              </Button>
            </div>
            <p
              style={{
                fontSize: '19px',
                marginBottom: 28,
                marginTop: 64,
                fontFamily: 'Alibaba-PuHuiTi-Medium',
              }}
            >
              2）根据教程配置签名
            </p>
            <p
              style={{
                fontSize: '15px',
                marginBottom: 12,
                fontFamily: 'Alibaba-PuHuiTi-Medium',
              }}
            >
              企业邮箱
            </p>
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
                  color: 'black',
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
                  color: 'black',
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
                  color: 'black',
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
                  color: 'black',
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
                  color: 'black',
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
