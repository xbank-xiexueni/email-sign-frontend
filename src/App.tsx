import { Button } from 'antd';
import * as clipboard from 'clipboard-polyfill';

const App = () => {
  // 因为需要特殊的字体，所以需要加载字体文件

  const handleCopy = async () => {
    const mailDom = document.querySelector('.preview')?.innerHTML || '';
    const item = new clipboard.ClipboardItem({
      'text/html': new Blob([mailDom], { type: 'text/html' }),
    });
    await clipboard.write([item]);
  };

  return (
    <div className='App'>
      <Button onClick={handleCopy} className='btn'>
        copy
      </Button>
      <div className='preview'>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 16,
              borderRadius: 10,
              borderColor: 'gray',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <img src={`${window?.location?.origin}/logo1.png`} />

            <h1>hahahhaah</h1>
          </div>
          <a href='https://www.baidu.com'>
            <svg
              width='16'
              height='17'
              viewBox='0 0 16 17'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9.00065 2.43315C9.00065 2.06496 8.70217 1.76648 8.33398 1.76648H7.66732C7.29913 1.76648 7.00065 2.06496 7.00065 2.43315V7.43315H2.00065C1.63246 7.43315 1.33398 7.73162 1.33398 8.09981V8.76648C1.33398 9.13467 1.63246 9.43315 2.00065 9.43315H7.00065V14.4331C7.00065 14.8013 7.29913 15.0998 7.66732 15.0998H8.33398C8.70217 15.0998 9.00065 14.8013 9.00065 14.4331V9.43315H14.0007C14.3688 9.43315 14.6673 9.13467 14.6673 8.76648V8.09981C14.6673 7.73162 14.3688 7.43315 14.0007 7.43315H9.00065V2.43315Z'
                fill='#0000FF'
              />
            </svg>
            我是一个链接
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
