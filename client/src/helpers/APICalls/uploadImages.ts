import { S3UploadAPIData } from '../../interface/S3Upload';
import { FetchOptions } from '../../interface/FetchOptions';
import API from '../../API';

const uploadImagesAPI = async (data: FormData): Promise<S3UploadAPIData> => {
  const fetchOptions: FetchOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: data,
    credentials: 'include',
  };
  return await fetch(`${API}/upload/uploadimage`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: 'Unable to connect to server. Please try again',
    }));
};

export default uploadImagesAPI;
