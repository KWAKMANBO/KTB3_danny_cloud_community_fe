import {deleteRequest, get, post, patch} from './const/requestconst.js';
import {commentComponent} from '../page/component/post/commentcomponent.js';
import {getDate, requireAuth} from "./common.js";
import {API, PAGE} from './const/const.js';
import {showDialog} from '../page/component/common/dialogcomponent.js';

// 인증 체크
requireAuth();

const postId = window.location.pathname.split('/')[2];
let nextCursor = null;
let hasNext = true;
let isLoading = false;
let isSubmittingComment = false;

const backButton = document.querySelector(".back-btn")
backButton.addEventListener('click', () => {
    window.location.href = PAGE.POST_LIST_PAGE;
})

const loadPostDetail = async () => {
    if (!postId) {
        alert("게시물을 찾을 수 없습니다.");
        return;
    }

    const response = await get(`${API.POST}/${postId}`, {});

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
    const response = await get(`${API.POST}/${postId}/comments`, params);

    if (response && response.data) {

        const {comments, next_cursor, has_next} = response.data;

        nextCursor = next_cursor;
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
        loadComments(nextCursor)
    }
};

// 게시물 상세 정보 렌더링
const renderPostDetail = (post) => {
    document.querySelector('.post-title').textContent = post.title;
    document.querySelector('.author-name').textContent = post.author;

    document.querySelector('.post-date').textContent = getDate(post.created_at);
    document.querySelector('.post-content p').textContent = post.content;

    // 작성자 프로필 이미지 렌더링
    const authorProfileElement = document.querySelector('.author-profile');
    if (post.authorProfileImageUrl && authorProfileElement) {
        authorProfileElement.style.backgroundImage = `url(${post.authorProfileImageUrl})`;
        authorProfileElement.style.backgroundSize = 'cover';
        authorProfileElement.style.backgroundPosition = 'center';
    }

    // 이미지 렌더링
    const postImageContainer = document.querySelector(".post-image");
    if (post.images && post.images.length > 0) {
        postImageContainer.style.display = "block";
        postImageContainer.innerHTML = post.images.map(imageUrl =>
            `<img src="${imageUrl}" alt="게시글 이미지" class="post-image-item">`
        ).join('');
    } else {
        postImageContainer.style.display = "none";
    }

    if (!post.is_mine) document.querySelector('.post-actions').style.display = "none";

    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers[0].textContent = post.likes;
    statNumbers[1].textContent = post.views;
    statNumbers[2].textContent = post.comments;

    // 좋아요 버튼 상태 업데이트
    updateLikeButton(post.is_liked);
};

// 좋아요 버튼 상태 업데이트
const updateLikeButton = (isLiked) => {
    const likeBtn = document.querySelector('#like-btn');
    const likeIcon = document.querySelector('.like-icon');
    const likeText = document.querySelector('.like-text');

    if (isLiked) {
        likeBtn.classList.add('liked');
        likeIcon.textContent = '♥';
        likeText.textContent = '좋아요';
    } else {
        likeBtn.classList.remove('liked');
        likeIcon.textContent = '♡';
        likeText.textContent = '좋아요';
    }
};

// 좋아요 토글 함수
const toggleLike = async () => {
    const likeBtn = document.querySelector('#like-btn');
    const isLiked = likeBtn.classList.contains('liked');

    try {
        console.log(isLiked)
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
            updateLikeButton(response.data.is_liked);

            // 좋아요 수 업데이트
            // const statNumbers = document.querySelectorAll('.stat-number');
            // const currentLikes = parseInt(statNumbers[0].textContent);
            // statNumbers[0].textContent = response.data.is_liked ? currentLikes + 1 : currentLikes - 1;
        } else {
            alert('좋아요 처리에 실패했습니다.');
        }
    } catch (error) {
        console.error('좋아요 처리 중 오류:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
    }
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

// const options = {
//     root: null,
//     threshold: 0.1
// }
//
// let observer = new IntersectionObserver((entries, observer) => {
//
//     entries.forEach(entry => {
//         const comments = decument.querySelector(".comment-list");
//
//         if (entry.isIntersecting) {
//
//         }
//     })
// })

document.querySelector("#edit-btn").addEventListener("click", () => {
    window.location.replace(`${PAGE.POST_MODIFY_PAGE}?postId=${postId}`);
})

document.querySelector("#remove-btn").addEventListener("click", () => {
    showDialog("삭제하시겠습니까?", async () => {
        try {
            const response = await deleteRequest(`${API.POST}/${postId}`);

            if (response) {
                // TODO : alert 토스트 형식으로 변경하기
                alert("게시글이 삭제 되었습니다.");
                window.location.replace(`${PAGE.POST_LIST_PAGE}`)
            } else {
                // TODO : alert 토스트 형식으로 변경하기
                alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("게시글 삭제 오류 발생 : ", error)
            alert("게시글 삭제 중 오류 발생");
        }


    });
})

// 댓글 입력 관련 요소
const commentInput = document.querySelector('#comment-input');
const currentCountSpan = document.querySelector('#current-count');
const commentSubmitButton = document.querySelector('.comment-submit-btn');

// 댓글 글자 수 카운팅
commentInput.addEventListener('input', () => {
    const currentLength = commentInput.value.length;
    currentCountSpan.textContent = currentLength;
});

// 댓글 작성
const submitComment = async () => {
    // 이미 제출 중이면 무시
    if (isSubmittingComment) {
        return;
    }

    const content = commentInput.value.trim();

    if (!content) {
        return;
    }

    if (content.length > 200) {
        return;
    }

    isSubmittingComment = true;

    try {
        const response = await post(`${API.POST}/${postId}/comments`, {
            content: content
        });

        if (response) {
            // 댓글 입력창 초기화
            commentInput.value = '';
            currentCountSpan.textContent = '0';

            // 댓글 목록 새로고침
            nextCursor = null;
            hasNext = true;
            await loadComments();

        } else {
            // TODO : toast로 변경하기
            alert('댓글 등록에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('댓글 등록 오류:', error);
        alert('댓글 등록 중 오류가 발생했습니다.');
    } finally {
        isSubmittingComment = false;
    }
};

// 댓글 등록 버튼 클릭 이벤트
commentSubmitButton.addEventListener('click', submitComment);

// Enter 키로 댓글 등록 (Shift+Enter는 줄바꿈)
commentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitComment();
    }
});

// 좋아요 버튼 클릭 이벤트
document.querySelector('#like-btn').addEventListener('click', toggleLike);

// 댓글 수정 모드 진입
const enterEditMode = (commentItem) => {
    const commentContent = commentItem.querySelector('.comment-content');
    const commentActions = commentItem.querySelector('.comment-actions');
    const originalContent = commentContent.textContent;


    commentItem.dataset.originalContent = originalContent;

    commentContent.innerHTML = `
        <textarea class="comment-edit-textarea" maxlength="200">${originalContent}</textarea>
        <span class="char-count"><span class="edit-current-count">${originalContent.length}</span>/200</span>
    `;


    const textarea = commentContent.querySelector('.comment-edit-textarea');
    const charCountSpan = commentContent.querySelector('.edit-current-count');
    textarea.addEventListener('input', () => {
        charCountSpan.textContent = textarea.value.length;
    });

    commentActions.innerHTML = `
        <button class="action-btn comment-save-btn">저장</button>
        <button class="action-btn comment-cancel-btn">취소</button>
    `;
};

const exitEditMode = (commentItem) => {
    const commentContent = commentItem.querySelector('.comment-content');
    const commentActions = commentItem.querySelector('.comment-actions');
    const originalContent = commentItem.dataset.originalContent;

    commentContent.textContent = originalContent;
    commentActions.innerHTML = `
        <button class="action-btn comment-edit-btn">수정</button>
        <button class="action-btn comment-delete-btn">삭제</button>
    `;

    delete commentItem.dataset.originalContent;
};

document.querySelector('.comment-list').addEventListener('click', async (e) => {
    const commentItem = e.target.closest('.comment-item');
    if (!commentItem) return;

    if (e.target.classList.contains('comment-edit-btn')) {
        enterEditMode(commentItem);
    }

    if (e.target.classList.contains('comment-save-btn')) {
        const commentId = commentItem.dataset.commentId;
        const textarea = commentItem.querySelector('.comment-edit-textarea');
        const newContent = textarea.value.trim();

        if (!newContent) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        if (newContent.length > 200) {
            alert('댓글은 200자 이하로 작성해주세요.');
            return;
        }

        try {
            const response = await patch(API.COMMENT_UPDATE(postId), {
                comment_id: parseInt(commentId),
                content: newContent
            });

            if (response) {
                alert('댓글이 수정되었습니다.');
                // 댓글 목록 새로고침
                nextCursor = null;
                hasNext = true;
                await loadComments();
            } else {
                alert('댓글 수정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('댓글 수정 오류:', error);
            alert('댓글 수정 중 오류가 발생했습니다.');
        }
    }

    // 취소 버튼 클릭
    if (e.target.classList.contains('comment-cancel-btn')) {
        exitEditMode(commentItem);
    }

    // 삭제 버튼 클릭
    if (e.target.classList.contains('comment-delete-btn')) {
        const commentId = commentItem.dataset.commentId;

        showDialog("댓글을 삭제하시겠습니까?", async () => {
            try {
                const response = await deleteRequest(API.COMMENT_DELETE(commentId));

                if (response) {
                    alert("댓글이 삭제되었습니다.");
                    // 댓글 목록 새로고침
                    nextCursor = null;
                    hasNext = true;
                    await loadComments();
                } else {
                    alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
                }
            } catch (error) {
                console.error("댓글 삭제 오류:", error);
                alert("댓글 삭제 중 오류가 발생했습니다.");
            }
        });
    }
});

window.addEventListener('scroll', handleScroll);

window.addEventListener('load', async () => {
    await loadPostDetail();
});

