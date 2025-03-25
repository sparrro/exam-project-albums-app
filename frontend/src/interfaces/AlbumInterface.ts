export default interface AlbumInterface {
    albumId: string,
    title: string,
    titleLower: string,
    artist: string,
    globalTags?: Record<string, number>,
    addedBy: string[] | null,
}