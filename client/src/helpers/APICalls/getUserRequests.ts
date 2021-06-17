import { FetchOptions } from '../../context/interface/FetchOptions';
import GetRequestApiData from '../../interface/Request';

export async function getUserRequests(): Promise<GetRequestApiData> {
  const fetchOptions: FetchOptions = {
    method: 'GET',
    credentials: 'include',
  };
  return await fetch(`/`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' },
    }));
}
