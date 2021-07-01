import { AuthApiData } from '../../context/interface/AuthApiData';
import { FetchOptions } from '../../context/interface/FetchOptions';
import API from '../../API';

const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  isDogSitter: boolean,
): Promise<AuthApiData> => {
  const fetchOptions: FetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password, isDogSitter }),
    credentials: 'include',
  };
  return await fetch(`${API}/auth/register`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' },
    }));
};

export default register;
