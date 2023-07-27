import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Popover, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { parse, stringify } from 'query-string';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';

const { Search } = Input;
const { TabPane } = Tabs;

const SearchBox = () => {
  const [activeKey, setActiveKey] = useState('company');// 当前激活面板
  const [searchText, setSearchText] = useState('');
  const [historyList, setHistoryList] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHoveredIndex, setIsHoveredIndex] = useState(-1);
  const [preSearchResults, setPreSearchResults] = useState([]);
  const preSearchTimerRef = useRef(null);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['historyList']);

  useEffect(() => {
    // 从 Cookie 中获取历史记录列表
    const storedHistoryList = cookies.historyList;
    console.log("🚀 ~ file: SearchBox.js:30 ~ useEffect ~ storedHistoryList:", storedHistoryList)
    if (storedHistoryList) {
      setHistoryList(storedHistoryList);
    }
  }, []);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  //让字符串没有html标签 
  const handleStr=(str)=>{
    return str.replace(/<[^>]+>/g,'')
  }

  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2);
    return timestamp + random;
  };

  const handleSearch = (value) => {
    var obj= preSearchResults.find(i=>i.q==value)
    var newValue={
      id:obj?obj.id:generateUniqueId(),
      q:value
    }
    const newHistoryList = [newValue, ...historyList.slice(0, 4)];

    setHistoryList(newHistoryList);
    setSearchText('');
    setHighlightedIndex(-1);

    // 存储 historyList 到 cookie
    setCookie('historyList', newHistoryList);

    setCookie('preSearchResults', preSearchResults);
    // 跳转到搜索结果页面
    navigate(`/searchList?id=${newValue.id}`);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setHighlightedIndex(-1);

    // 延时预搜索
    clearTimeout(preSearchTimerRef.current);
    preSearchTimerRef.current = setTimeout(() => {
      // 执行预搜索逻辑，此处使用fetch进行异步请求获取数据
      fetch(`http://localhost:3000/data?q=${value}`)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          console.log("🚀 ~ file: SearchBox.js:46 ~ .then ~ data:", data)
          // 对获取到的数据进行筛选和设置
          var results = data.g || []
          // const results = arr.filter((result) =>
          //   result.name.includes(value)
          // );
          results.forEach((i)=>{
              i.id=i.sa
             i.q=i.q.replace(new RegExp(value, 'g'), `<span class='spanColor'>${value}</span>`);
          })
          setPreSearchResults(results);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, 300);
  };

  const handleClearHistory = () => {
    setHistoryList([]);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : (searchText ? preSearchResults.length - 1 : historyList.length - 1)
      );
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < (searchText ? preSearchResults.length - 1 : historyList.length - 1) ? prevIndex + 1 : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        const selectedValue = searchText ? preSearchResults[highlightedIndex]?.q : historyList[highlightedIndex]?.q;
        if (selectedValue) {
          setSearchText(selectedValue);
          handleSearch(selectedValue);
        }
      }
      
    }
  };

  const handlePreSearchItemClick = (index,item) => {
    setSearchText(handleStr(item.q));
    handleSearch(item.q)
  };

  const handlePreSearchItemMouseEnter = (index,item) => {
    setIsHoveredIndex(index);
  };

  const handlePreSearchItemMouseLeave = () => {
    setIsHoveredIndex(-1);
  };


  const handleHistoryItemClick = (index) => {
    setSearchText(handleStr(historyList[index].q));
    handleSearch(historyList[index].q)
  };

  const handleHistoryItemMouseEnter = (index) => {
    setIsHoveredIndex(index);
  };

  const handleHistoryItemMouseLeave = () => {
    setIsHoveredIndex(-1);
  };


  const items = [
    {
      key: 'company',
      label: '查公司',
      children: (
        <Popover
          content={
            <div className="history-list">
              {
                !searchText ?
                  (<div><div className="popover-title">
                    历史搜索
                    <Button onClick={handleClearHistory} className="popover-button" style={{ float: 'right' }} size="small" type="text" icon={<DeleteOutlined />}>
                      清空
                    </Button>
                  </div>
                    <TransitionGroup component={null}>
                      {historyList.length && historyList.map((item, index) => (
                        <CSSTransition key={index} timeout={300} classNames="history-item">
                          <div
                            className={`history-item ${index === highlightedIndex ? 'highlighted' : ''} ${index === isHoveredIndex ? 'hovered' : ''}`}
                            onClick={() => handleHistoryItemClick(index)}
                            onMouseEnter={() => handleHistoryItemMouseEnter(index)}
                            onMouseLeave={handleHistoryItemMouseLeave}
                          >
                            <div dangerouslySetInnerHTML={{ __html: item.q }}></div>
                          </div>
                        </CSSTransition>
                      ))}
                    </TransitionGroup></div>)
                  : (<div>
                    {/*  预搜索 */}
                    <div className="popover-title">
                    </div>
                    <TransitionGroup component={null}>
                      {preSearchResults.length && preSearchResults.map((item, index) => (
                        <CSSTransition key={`${item.q}-${index}`} timeout={300} classNames="history-item">
                          <div
                            className={`history-item ${index === highlightedIndex ? 'highlighted' : ''} ${index === isHoveredIndex ? 'hovered' : ''}`}
                            onClick={() => handlePreSearchItemClick(index,item)}
                            onMouseEnter={() => handlePreSearchItemMouseEnter(index,item)}
                            onMouseLeave={handlePreSearchItemMouseLeave}
                            
                          >
                            <div dangerouslySetInnerHTML={{ __html: item.q }}></div>
                            <Button onClick={() => { handleSearch(item.q) }} className="popover-button" style={{ position:'absolute',top:'6px',right:0, backgroundColor: '#50AFC6' }} size="small" type="primary" >
                              企业名称匹配
                            </Button>
                          </div>
                        </CSSTransition>
                      ))}

                    </TransitionGroup>
                  </div>)
              }

            </div>
          }
          trigger="click"
          open={activeKey=='company'&&focused && (historyList.length || preSearchResults.length)}
          overlayClassName="history-popover"
          placement="bottomLeft"
        >
          <Search
            placeholder="请输入公司、人名、品牌、企业特征等关键词"
            enterButton="搜一下"
            value={searchText}
            onChange={handleInputChange}
            onSearch={handleSearch}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setFocused(true)}
          onBlur={()=>{
            setTimeout(()=>{setFocused(false)},500)
          }}
          />

        </Popover>
      ),
    },
    {
      key: 'group',
      label: '查集团',
      // children: 'Content of Tab Pane 2',
    },
    {
      key: 'risk',
      label: '查风险',
      // children: 'Content of Tab Pane 3',
    },
    {
      key: 'relationship',
      label: '查关系',
      // content: 'Content of Tab Pane 4',
    },
  ];

  return (
    <CookiesProvider>
      <div className="search-container">      <Tabs  defaultActiveKey='company' onChange={handleTabChange}  activeKey={activeKey} centered className="custom-tabs" tabBarStyle={{ color: '#fff' }} items={items}>
      </Tabs></div>

    </CookiesProvider>

  );
};

export default SearchBox;
