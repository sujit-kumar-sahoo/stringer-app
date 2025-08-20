import api from '../utilis/api';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const response = await api.post(
                                    `/api/common/generate-presigned-url`, 
                                    { 
                                      file_name: fileName, 
                                      file_type: fileType 
                                    },
                                  );
  return response.data; // includes {url, fields}
};

export const uploadToS3 = async (presignedData: any, file: File) => {
  const formData = new FormData();
  Object.entries(presignedData.fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  formData.append("file", file);

  const upload = await fetch(presignedData.url, {
    method: "POST",
    body: formData,
  });

  if (!upload.ok) {
    throw new Error("Upload to S3 failed");
  }

  return `${presignedData.url}/${presignedData.fields.key}`;
};


