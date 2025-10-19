import {get} from './RequestConst.js';
import {commentComponent} from '../page/component/post/CommentComponent.js';

const postId = window.location.pathname.split('/')[2];

const loadPostDetail = async () => {

    if (!postId) {
        alert("게시물을 찾을 수 없습니다.");
        return;
    }

    const response = await get(`http://localhost:8080/posts/${postId}`, {});

    if (response && response.data) {
        renderPostDetail(response.data);
        // 댓글 목록 로드
        await loadComments();
    } else {
        alert('게시물을 찾을 수 없습니다.');
    }
};

// 댓글 목록 로드
const loadComments = async () => {
    const response = await get(`http://localhost:8080/posts/${postId}/comments`, {});

    if (response && response.data) {
        console.log('댓글 API 응답:', response.data);

        // response.data가 배열인지 객체인지 확인
        const comments = Array.isArray(response.data) ? response.data : response.data.comments || [];

        renderComments(comments);
    } else {
        console.log('댓글을 불러오지 못했습니다.');
    }
};

// 게시물 상세 정보 렌더링
const renderPostDetail = (post) => {
    document.querySelector('.post-title').textContent = post.title;
    document.querySelector('.author-name').textContent = post.author;
    document.querySelector('.post-date').textContent = post.createAt;
    document.querySelector('.post-content p').textContent = post.content;

    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers[0].textContent = post.likes;
    statNumbers[1].textContent = post.views;
    statNumbers[2].textContent = post.comments;
};

// 댓글 목록 렌더링
const renderComments = (comments) => {
    const commentList = document.querySelector('.comment-list');

    if (comments.length === 0) {
        commentList.innerHTML = '<p>댓글이 없습니다.</p>';
        return;
    }

    // 각 댓글을 commentComponent로 변환하여 HTML 생성
    const html = comments.map(comment => commentComponent(comment)).join('');
    commentList.innerHTML = html;

};

window.addEventListener('load', async () => {
    await loadPostDetail();
});

