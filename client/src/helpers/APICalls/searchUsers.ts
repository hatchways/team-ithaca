import { FetchOptions } from '../../context/interface/FetchOptions';
import { SearchUsersApiData } from '../../context/interface/User';
import API from '../../API';

interface Props {
  search: string;
}

export async function searchUsers({ search }: Props): Promise<SearchUsersApiData> {
  const fetchOptions: FetchOptions = {
    method: 'GET',
    credentials: 'include',
  };
  return await fetch(`${API}/users?search=${search}`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' },
    }));
}
