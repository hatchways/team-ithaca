import { FetchOptions } from '../../interface/FetchOptions';
import { RequestApiData, Request } from '../../interface/Request';
import API from '../../API';

export const createRequest = async (data: Request): Promise<RequestApiData> => {
  const fetchOptions: FetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data }),
    credentials: 'include',
  };
  return await fetch(`${API}/request/create`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' },
    }));
};

export const updateRequest = async (
  requestId: string,
  accepted: boolean,
  declined: boolean,
): Promise<RequestApiData> => {
  const fetchOptions: FetchOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accepted, declined }),
    credentials: 'include',
  };
  return await fetch(`${API}/request/update/${requestId}`, fetchOptions)
    .then((res) => res.json())
    .catch((error) => {
      console.log({ error });
      return {
        error: 'Unable to connect to server. Please try again',
      };
    });
};
