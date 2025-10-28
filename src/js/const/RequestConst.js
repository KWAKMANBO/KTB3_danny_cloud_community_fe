const METHOD = {
    GET: "GET",
    POST: "POST",
    DELETE: "DELETE",
    PATCH: "PATCH",
    PUT: "PUT"
}

export const post = async (url, data) => {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        // localStorage에서 accessToken 가져오기
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const response = await fetch(url, {
            method: METHOD.POST,
            credentials: "include",
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("POST 요청 실패:", error);
        return null;
    }
}

export const get = async (url, params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;

        const headers = {};

        // localStorage에서 accessToken 가져오기
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const response = await fetch(fullUrl, {
            method: METHOD.GET,
            credentials: "include",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("GET 요청 실패:", error);
        return null;
    }
}

export const patch = async (url, data) => {
    try {
        const headers = {
            "Content-Type": "application/json",
        }

        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const response = await fetch(url, {
            method: METHOD.PATCH,
            credentials: "include",
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("PATCH 요청 실패:", error);
        return null;
    }
}