const express = require('express')
const app = express()
const path = require('path')

app.listen(3000, () => {
    console.log("http://localhost:3000에서 서버 실행 중 ")
});

app.use(express.static(path.join(__dirname, 'src')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'login.html'));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'signup.html'));
})

app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'posts.html'));
})

// 추후 상세한 아이디로 변경하기
app.get('/posts/id', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'postDetail.html'));
})

// 추후 상세한 아이디로 변경하기
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'writePost.html'));
})