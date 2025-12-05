import {postComponent} from "../page/component/post/postcomponent.js";
import {get, post, deleteRequest} from "./const/requestconst.js";
import {API, PAGE} from './const/const.js';
import {requireAuth} from './common.js';

// 인증 체크
requireAuth();

const writeButton  = document.querySelector(".write-post-btn");
writeButton.addEventListener('click', ()=>{
    window.location.href = PAGE.POST_WRITE_PAGE;
})


const postList = document.querySelector('.post-list');

// 페이징 상태 관리
let nextCursor = null;
let hasNext = true;
let isLoading = false;

// 게시물 로드 함수
const loadPosts = async (cursor = null) => {
    if (isLoading || !hasNext) return;

    isLoading = true;

    const params = cursor ? {cursor} : {};
    const response = await get(API.POST, params);
    console.log(response.data)
    if (response && response.data) {
        const {posts, next_cursor, has_next} = response.data;
        // 각 게시물을 postComponent로 변환하여 HTML 생성
        const html = posts.map(post => postComponent(post)).join('');

        // 첫 로드면 innerHTML, 추가 로드면 insertAdjacentHTML
        if (cursor) {
            postList.insertAdjacentHTML('beforeend', html);
        } else {
            postList.innerHTML = html;
        }

        // 페이징 상태 업데이트
        nextCursor = next_cursor;
        hasNext = has_next;

    } else {
        if (!cursor) {
            postList.innerHTML = '<p>게시물이 없습니다.</p>';
        }
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
        loadPosts(nextCursor);
    }
};

// 좋아요 토글 함수
const toggleLike = async (postId, likeBtn) => {
    const isLiked = likeBtn.classList.contains('liked');

    try {
        let response;
        if (isLiked) {
            // 좋아요 취소
            response = await deleteRequest(API.POST_LIKE(postId));
        } else {
            // 좋아요 추가
            response = await post(API.POST_LIKE(postId), {});
        }

        if (response && response.data) {
            // 좋아요 상태 업데이트
            const likeIcon = likeBtn.querySelector('.like-icon');
            const likeCount = likeBtn.querySelector('.like-count');

            if (response.data.is_liked) {
                likeBtn.classList.add('liked');
                likeIcon.textContent = '♥';
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
            } else {
                likeBtn.classList.remove('liked');
                likeIcon.textContent = '♡';
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
            }
        } else {
            alert('좋아요 처리에 실패했습니다.');
        }
    } catch (error) {
        console.error('좋아요 처리 중 오류:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
    }
};

// 게시물 클릭 이벤트 (이벤트 위임)
postList.addEventListener('click', (e) => {
    // 좋아요 버튼 클릭 처리
    const likeBtn = e.target.closest('.post-like-btn');
    if (likeBtn) {
        e.stopPropagation();
        const postId = likeBtn.dataset.postId;
        toggleLike(postId, likeBtn);
        return;
    }

    // 클릭된 요소가 post-card 또는 그 자식 요소인지 확인
    const postCard = e.target.closest('.post-card');
    console.log(postCard)
    if (postCard) {
        const postId = postCard.dataset.postId;

        // 게시물 상세 페이지로 이동 (경로변수 방식)
        window.location.href = `${PAGE.POST_DETAIL}/${postId}`;
    }
});

// 초기 로드
window.addEventListener('load', async () => {
    await loadPosts();
});

// 스크롤 이벤트 등록
window.addEventListener('scroll', handleScroll);



