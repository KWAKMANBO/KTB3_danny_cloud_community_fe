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

// 게시글 작성 페이지
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'writePost.html'));
})

// 게시글 수정 페이지 (구체적인 경로를 먼저)
app.get('/post/correction', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'modifyPost.html'));
})

// 게시물 상세 페이지 (경로변수는 마지막에)
app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    console.log('요청된 게시물 ID:', postId);
    res.sendFile(path.join(__dirname, 'src', 'page', 'postDetail.html'));
})

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'profile.html'));
})

app.get('/profile/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'page', 'password.html'));
})