export default interface TagsInterface {
    username: string;
    albumId: string;
    title: string;
    tags: string[];
    onClick?: () => void;
}