
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import  queryString  from 'query-string';
import { CookiesProvider, useCookies } from 'react-cookie';

const SearchList = () => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [cookies, setCookie] = useCookies(['preSearchResults']);  

  const { id } = queryParams;

  useEffect(() => {
    // 从 Cookie 中获取历史记录列表
    const storedHistoryList = cookies.historyList;
    console.log("🚀 ~ file: SearchList.js:15 ~ useEffect ~ storedHistoryList:", storedHistoryList)

  }, []);

  return (
    <div>
      <h1>Search List</h1>
      <p>Search ID: {id}</p>
      <p>Search Name: {(cookies.preSearchResults.concat(cookies.historyList).find(i=>i.id==id))&&(cookies.preSearchResults.concat(cookies.historyList).find(i=>i.id==id)).q.replace(/<span[^>]*>/g, "").replace(/<\/span>/g, "")}</p>
    </div>
  );
};

export default SearchList;
