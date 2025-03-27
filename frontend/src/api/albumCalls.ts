const BASE_URL = "https://uy1biworif.execute-api.eu-north-1.amazonaws.com";

export const apiTitleSearch = async (title: string) => {
    try {
        const response = await fetch(`${BASE_URL}/album/?albumTitle=${title}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const apiTagSearch = async (tags: string[]) => {
    try {
        const response = await fetch(`${BASE_URL}/album/tags`, {
            method: "post",
            body: JSON.stringify({
                tags: tags,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const apiGetAlbum = async (albumId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/album/idGet/?albumId=${albumId}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const apiEditTags = async (albumId: string, token: string, add: string[], remove: string[]) => {
    try {
        const response = await fetch(`${BASE_URL}/album/edit/?albumId=${albumId}`, {
            method: "put",
            body: JSON.stringify({
                add: add,
                remove: remove,
            }),
            headers: {
                "authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export const apiRemoveAlbum = async (albumId: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/album/remove/?albumId=${albumId}`, {
            method: "delete",
            headers: {
                "authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}