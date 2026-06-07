import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadImageMutation } from "@/service/menuItemApi"; // API upload ảnh
import { toast } from "sonner";

const ImageUpload = ({
  imageUrl,
  setImageUrl,
}: {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}) => {
  const [uploadImage] = useUploadImageMutation();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("files", file);

      try {
        const response = await uploadImage(formData).unwrap();
        if (!response.success) {
          toast.error("Lỗi khi tải ảnh");
          return;
        }else{
            toast.success("Tải ảnh thành công");
        }
        setImageUrl(response.urlImages[0]);
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        toast.error("Lỗi khi upload ảnh");
      }
    },
    [uploadImage, setImageUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });


  return (
    <div>
      {imageUrl ? (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="Ảnh món ăn"
            className="size-[200px] object-cover rounded-lg border border-gray-300"
          />
          <button
            onClick={() => setImageUrl("")}
            className="text-red-500 font-bold mt-2"
          >
            Xóa ảnh
          </button>
        </div>
      ) : (
        <div
          {...getRootProps({
            className:
              "border rounded py-4 px-6 text-center bg-slate-100 cursor-pointer size-[200px] flex flex-col items-center justify-center",
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Thả ảnh vào đây...</p>
          ) : (
            <p>Chọn ảnh</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
