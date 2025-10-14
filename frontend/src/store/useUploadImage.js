import { create } from "zustand";

export const useUploadImage = create(set => ({
    imageUrl: "",
    loading : false,
    error : null,
}))

uploadImage : async (file)