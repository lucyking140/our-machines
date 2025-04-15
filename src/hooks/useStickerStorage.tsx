// import {uploadedFileType} from "../types";

// export function uploadSticker({fileInfo}: {fileInfo: uploadedFileType}) {
//   // based on a provided file info json, add this 
//   // information to the list of stickers in localstorage
//   const str_file = JSON.stringify(fileInfo);

//   // getting current list
//   const all = getAllStickers();
//   var cur_files = {}
//   if(all){
//     cur_files = JSON.parse(all);
//   }

//   const new_files = JSON.stringify({...cur_files, str_file});

//   localStorage.setItem('stickers', new_files);
//   console.log("Finished setting new sticker in storage!");
// }

// export function getAllStickers(): string | null{
//     // need to pull all stickers from local storage 
//     // and return a JSON object like stickers.data.tsx
//     const files = localStorage.getItem('stickers');
//     console.log("current files in getAllStickers: ", files);
//     return files;
// }