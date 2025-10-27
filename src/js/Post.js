import {postComponent} from "../page/component/post/PostComponent.js";
import {get} from "./RequestConst.js";
import {API, PAGE} from './const/ConstUrl.js';
const postList = document.querySelector('.post-list');

// 페이징 상태 관리
let nextCursor = null;
let hasNext = true;
let isLoading = false;

// 게시물 로드 함수
const loadPosts = async (cursor = null) => {
   if (isLoading || !hasNext) return;

   isLoading = true;

   const params = cursor ? { cursor } : {};
   const response = await get(API.POST, params);

   if (response && response.data) {
      const { posts, next_cursor, has_next } = response.data;
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

// 게시물 클릭 이벤트 (이벤트 위임)
postList.addEventListener('click', (e) => {
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

