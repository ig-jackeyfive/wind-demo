const Mock = require('mockjs');

const axios = require('axios');

const express = require('express')
const app = express()
const bodyParser = require('body-parser'); //处理post请求参数
// 处理静态资源
app.use(express.static('public'));
// 处理参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 设置允许跨域访问该服务
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'mytoken');
    next();
});

// 获取github用户MrPanda的信息

app.get('/github', (req, res) => {

    axios.get('https://api.github.com/users/MrPanda')
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}
)

// 写一个防抖函数

function debounce(fn, delay) {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    }
}

// 写个匹配邮箱的正则表达式函数

function checkEmail(str) {
    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return reg.test(str);
}










// const data = Mock.mock({
//     'list|10': [
//         {
//             'highlight': { 'name|+1': ['<em>小米</em>科技有限责任公司', '<em>小米</em>电子科技有限公司', '<em>小米</em>通信技术有限公司', '<em>小米</em>集团有限公司', '<em>小米</em>智能科技有限公司'] },
//             'id|+1': 1,
//             is_fullmatch: false,
//             'name|+1': ['小米科技有限责任公司', '小米电子科技有限公司', '小米通信技术有限公司', '小米集团有限公司', '小米智能科技有限公司'],
//         },
//     ],
// });

// console.log(data.list);

// 路由
app.get('/data', (req, res) => {
    axios.get(`https://www.baidu.com/sugrec?wd=${req.query.q}`, {
        params: {
            pre: 1,
            p: 3,
            ie: 'utf-8',
            json: 1,
            prod: 'pc',
            from: 'pc_web',
            sugsid: '38515,36543,38687,38880,38795,38903,38767,38792,38843,38831,38581,38485,38806,38825,38823,38839,38636,26350,22160',
            // wd: '1a',
            req: 2,
            bs: '搜索引擎的接口不跨域',
            pbs: '搜索引擎的接口不跨域',
            csor: 2,
            pwd: 1,
            cb: 'jQuery11020830577815689395_1686906203442',
            _: 1686906203510
        }
    })
        .then((response) => {
            response=response.data
            var jsonpData = response.substring(response.indexOf("(") + 1, response.lastIndexOf(")"));
            var data = JSON.parse(jsonpData);
            console.log("🚀 ~ file: SearchBox.js:43 ~ preSearchTimerRef.current=setTimeout ~ response:", data)
            return res.send(data)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });

})
app.post('/post', (req, res) => {
    res.send(req.body);
})

app.post('/json', (req, res) => {
    res.send(req.body);
})



// 启动监听
app.listen(3000, () => {
    console.log('running 3000...')
})