const BASE_URL = "https://ihbduus1wd.execute-api.eu-north-1.amazonaws.com";

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