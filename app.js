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