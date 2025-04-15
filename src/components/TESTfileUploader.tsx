// 'use client';
// import { useState, useEffect } from 'react';

// export function FileUploader() {
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState(null);
  
//   // Load file from sessionStorage when component mounts
//   useEffect(() => {
//     try {
//       // Get file metadata from sessionStorage
//       const fileMetadata = sessionStorage.getItem('uploadedSvgFile');
//       if (fileMetadata) {
//         const parsedFile = JSON.parse(fileMetadata);
        
//         // Get file data from sessionStorage
//         const fileData = sessionStorage.getItem('svgFileData');
//         if (fileData) {
//           setFile({
//             ...parsedFile,
//             dataUrl: fileData
//           });
//         }
//       }
//     } catch (err) {
//       console.error('Error loading SVG file from sessionStorage:', err);
//       setError('Failed to load previously uploaded SVG file');
//     }
//   }, []);
  
//   const handleFileUpload = (event) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) return;
    
//     // SVG Type validation
//     if (selectedFile.type !== 'image/svg+xml') {
//       setError('Only SVG files are allowed.');
//       event.target.value = ''; // Reset the input
//       return;
//     }
    
//     // Size validation (limit to 2MB for SVG files)
//     if (selectedFile.size > 2 * 1024 * 1024) {
//       setError('SVG file is too large. Please select a file smaller than 2MB.');
//       event.target.value = ''; // Reset the input
//       return;
//     }
    
//     const reader = new FileReader();
    
//     reader.onload = (e) => {
//       const dataUrl = e.target.result;
      
//       // Additional validation: Check if the file content actually contains SVG
//       if (!dataUrl.includes('<svg') && !dataUrl.includes('<?xml')) {
//         setError('The file does not appear to be a valid SVG.');
//         return;
//       }
      
//       // Create file object with metadata
//       const newFile = {
//         name: selectedFile.name,
//         type: selectedFile.type,
//         size: selectedFile.size,
//         lastModified: selectedFile.lastModified,
//         uploadedAt: new Date().toISOString()
//       };
      
//       // Update state with new file
//       const fileWithData = {...newFile, dataUrl};
//       setFile(fileWithData);
      
//       // Store file in sessionStorage
//       try {
//         // Store metadata separately from the actual file data
//         const metadataForStorage = {...newFile};
//         sessionStorage.setItem('uploadedSvgFile', JSON.stringify(metadataForStorage));
        
//         // Store file data separately
//         sessionStorage.setItem('svgFileData', dataUrl);
//       } catch (err) {
//         console.error('Error saving to sessionStorage:', err);
//         setError('Failed to save SVG file. You may be out of storage space.');
//       }
//     };
    
//     reader.onerror = () => {
//       setError(`Error reading file: ${selectedFile.name}`);
//     };
    
//     // Read file as data URL
//     reader.readAsDataURL(selectedFile);
//   };
  
//   const removeFile = () => {
//     // Remove file data and metadata from sessionStorage
//     sessionStorage.removeItem('uploadedSvgFile');
//     sessionStorage.removeItem('svgFileData');
    
//     // Clear state
//     setFile(null);
    
//     // Reset the input value if it exists
//     const fileInput = document.getElementById('svgFileInput');
//     if (fileInput) fileInput.value = '';
//   };
  
//   // Helper function to format file size
//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return bytes + ' bytes';
//     else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
//     else return (bytes / 1048576).toFixed(1) + ' MB';
//   };
  
//   return (
//     <div className="w-full max-w-md p-4 border rounded-lg shadow-sm">
//       <h2 className="text-xl font-bold mb-4">SVG File Uploader</h2>
      
//       {!file ? (
//         <div className="mb-6">
//           <label 
//             htmlFor="svgFileInput" 
//             className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors"
//           >
//             <div className="mb-2">
//               <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//               </svg>
//             </div>
//             <div className="text-sm font-medium text-gray-600">
//               Click to select an SVG file
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               Only SVG files are allowed (max 2MB)
//             </div>
//           </label>
//           <input 
//             id="svgFileInput" 
//             type="file" 
//             className="hidden" 
//             onChange={handleFileUpload}
//             accept=".svg,image/svg+xml" 
//           />
//         </div>
//       ) : (
//         <div className="text-center mb-4">
//           <button
//             onClick={() => {
//               document.getElementById('svgFileInput').click();
//             }}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Replace SVG File
//           </button>
//           <input 
//             id="svgFileInput" 
//             type="file" 
//             className="hidden" 
//             onChange={handleFileUpload}
//             accept=".svg,image/svg+xml" 
//           />
//         </div>
//       )}
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
//           {error}
//           <button 
//             className="ml-2 text-red-500 hover:text-red-700"
//             onClick={() => setError(null)}
//           >
//             ✕
//           </button>
//         </div>
//       )}
      
//       {file && (
//         <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
//           <div className="flex justify-between items-center">
//             <div className="flex-1 truncate">
//               <div className="font-medium text-gray-800 truncate">{file.name}</div>
//               <div className="text-xs text-gray-500 flex space-x-2">
//                 <span>{formatFileSize(file.size)}</span>
//                 <span>•</span>
//                 <span>SVG</span>
//               </div>
//             </div>
            
//             <div className="flex space-x-2">
//               <a
//                 href={file.dataUrl}
//                 download={file.name}
//                 className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
//               >
//                 Download
//               </a>
//               <button
//                 onClick={removeFile}
//                 className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
          
//           <div className="mt-4 bg-white p-4 border rounded-md">
//             <div className="text-center text-sm text-gray-500 mb-2">SVG Preview</div>
//             <div 
//               className="flex items-center justify-center h-40 bg-gray-100 rounded"
//               dangerouslySetInnerHTML={{ __html: file.dataUrl.split(',')[1] ? atob(file.dataUrl.split(',')[1]) : '' }}
//             />
//           </div>
          
//           {/* Optional: Show SVG code */}
//           <div className="mt-3">
//             <details>
//               <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
//                 View SVG Code
//               </summary>
//               <pre className="mt-2 p-2 bg-gray-800 text-green-400 text-xs overflow-x-auto rounded-md">
//                 {file.dataUrl.split(',')[1] ? atob(file.dataUrl.split(',')[1]) : 'No SVG content available'}
//               </pre>
//             </details>
//           </div>
//         </div>
//       )}
      
//       <div className="mt-4 text-xs text-gray-500">
//         <p>Note: This SVG file is stored only in your browser's session storage and will be lost when you close this tab/window.</p>
//       </div>
//     </div>
//   );
// }