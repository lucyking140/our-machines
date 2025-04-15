export interface Model3D {
    name: string;
    modelPath: string;
    textContent: string;
}

// export type {Model3D as Model3DType};
export type Model3dType = { model: Model3D };
