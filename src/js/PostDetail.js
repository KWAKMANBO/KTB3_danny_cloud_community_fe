import {get} from './RequestConst.js';
import {commentComponent} from '../page/component/post/CommentComponent.js';
import {getDate} from "./Common.js";

const postId = window.location.pathname.split('/')[2];
let nextCrusor = null;
let hasNext = true;
let isLoading = false;


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
const loadComments = async (cursor = null) => {
    // loading 상태이거나 다음 댓글이 없다면 렌더링 X
    if (isLoading || !hasNext) return;

    isLoading = true;

    const params = cursor ? {cursor} : {};
    const response = await get(`http://localhost:8080/posts/${postId}/comments`, params);

    if (response && response.data) {

        const {comments, next_cursor, has_next} = response.data;

        nextCrusor = next_cursor;
        hasNext = has_next;
        renderComments(comments || [], cursor);
    } else {
        console.error('댓글을 불러오지 못했습니다.');
    }

    isLoading = false;
};

// 스크롤 이벤트 리스너
const handleScroll = () => {
    // 스크롤이 하단에 가까워지면 다음 페이지 로드
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 하단에서 300px 이내에 도달하면 로드
    if (scrollTop + windowHeight >= documentHeight - 300) {
        loadComments(nextCrusor)
    }
};

// 게시물 상세 정보 렌더링
const renderPostDetail = (post) => {
    console.log(post);
    document.querySelector('.post-title').textContent = post.title;
    document.querySelector('.author-name').textContent = post.author;

    document.querySelector('.post-date').textContent = getDate(post.created_at);
    document.querySelector('.post-content p').textContent = post.content;

    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers[0].textContent = post.likes;
    statNumbers[1].textContent = post.views;
    statNumbers[2].textContent = post.comments;
};

// 댓글 목록 렌더링
const renderComments = (comments, cursor = null) => {
    const commentList = document.querySelector('.comment-list');

    if (comments.length === 0 && !cursor) {
        commentList.innerHTML = '<p>댓글이 없습니다.</p>';
        return;
    }
    const html = comments.map(comment => commentComponent(comment)).join('');
    if (!cursor) {
        // 각 댓글을 commentComponent로 변환하여 HTML 생성
        commentList.innerHTML = html;
    } else {
        const html = comments.map(comment => commentComponent(comment)).join('');
        commentList.insertAdjacentHTML('beforeend', html);
    }


};

window.addEventListener('scroll', handleScroll);

window.addEventListener('load', async () => {
    await loadPostDetail();
});

