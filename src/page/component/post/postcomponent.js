import {getDate} from "../../../js/common.js";

export const postComponent = (data) => {
    // 작성자 프로필 이미지 처리
    const authorProfileStyle = data.profile_image
        ? `style="background-image: url(${data.profile_image}); background-size: cover; background-position: center;"`
        : '';

    // 좋아요 상태에 따른 아이콘 및 클래스
    const likeIcon = data.is_liked ? '♥' : '♡';
    const likedClass = data.is_liked ? 'liked' : '';

    return `<article class="post-card" data-post-id="${data.id}">
            <div class="post-card-header">
                <h3 class="post-title">${data.title}</h3>
                <div class="post-info">
                    <button class="post-like-btn ${likedClass}" data-post-id="${data.id}">
                        <span class="like-icon">${likeIcon}</span>
                        <span class="like-count">${data.likes}</span>
                    </button>
                    <span class="info-item">댓글 ${data.comments}</span>
                    <span class="info-item">조회수 ${data.views}</span>
                    <span class="post-date">${getDate(data.created_at)}</span>
                </div>
            </div>
            <div class="post-card-footer">
                <div class="author-profile" ${authorProfileStyle}></div>
                <span class="author-name">${data.author}</span>
            </div>
        </article>`;
};



