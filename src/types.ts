export interface Model3D {
    name: string;
    modelPath: string;
    textContent: string;
}

// export type {Model3D as Model3DType};
export type Model3dType = { model: Model3D };

  /*
const newFile = {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            lastModified: selectedFile.lastModified,
            uploadedAt: new Date().toISOString()
          };
          
          // Update state with new file
          const fileWithData = {...newFile, url: dataUrl};

  */

export interface uploadedFile {
    name: string;
    type: string;
    size: number;
    lastModified: any;
    uploadedAt: any;
    url: string;
}

export type uploadedFileType = { file: uploadedFile };
