export const Documents = ["doc", "docx", "xlsx", "pptx", "pdf"];
export const Images = ["jpg", "jpeg", "gif", "png"];
export const Video = ["mp4", "wma", "webm"];
export const Music = ["mp3", "flac", "aac", "wma"];

export const FileMaxSize = 1000000; // 10 MB
export let TypesAccepted = (Types) => {
    return Array.prototype.concat(...Types);
}
export let GetInfoFile = (File) => {
    let filename = File.name;
    return filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
}