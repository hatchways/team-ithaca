import { FetchOptions } from '../../context/interface/FetchOptions';
import { EditProfileFields } from '../../context/useUserContext';
import API from '../../API';

interface AuthFieldsResult {
  error?: string;
  success?: string;
}

interface ProfileFieldsResult extends AuthFieldsResult {
  success?: string;
  profile?: EditProfileFields;
}

export const updateIsDogSitter = async (): Promise<{
  error?: string;
  success?: string;
  isDogSitter?: boolean;
}> => {
  const fetchOptions: FetchOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  return await fetch(`${API}/auth/update/isDogSitter`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: 'Unable to connect to server. Please try again',
    }));
};

export const updateAuthFields = async (firstName: string, lastName: string): Promise<AuthFieldsResult> => {
  const fetchOptions: FetchOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName }),
    credentials: 'include',
  };
  return await fetch(`${API}/auth/update`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' },
    }));
};

export const createOrUpdateProfileFields = async (fields: EditProfileFields): Promise<ProfileFieldsResult> => {
  const fetchOptions: FetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fields }),
    credentials: 'include',
  };
  return await fetch(`${API}/profile/createorupdate`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' },
    }));
};

export const getOneProfile = async (): Promise<ProfileFieldsResult> => {
  const fetchOptions: FetchOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  return await fetch(`${API}/profile/one`, fetchOptions)
    .then((res) => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' },
    }));
};
