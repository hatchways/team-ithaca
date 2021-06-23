import { FetchOptions } from '../../../context/interface/FetchOptions';
import { Profile } from '../../../interface/Profile';

const getOneProfile = async (id: string): Promise<Profile> => {
  const fetchOptions: FetchOptions = {
    method: 'GET',
    credentials: 'include',
  };
  return await fetch(`/profile/${id}`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' },
    }));
};

export default getOneProfile;
