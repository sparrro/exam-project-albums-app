interface albumInterface {
    artist: string,
    title: string,
    titleLower: string,
    albumId: string,
    addedBy: string[],
    globalTags: Map<string, number>
}

export {albumInterface}