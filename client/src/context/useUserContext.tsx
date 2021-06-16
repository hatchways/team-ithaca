import { useReducer, useContext, createContext, FunctionComponent } from 'react';

interface IUserContext {
  background: string;
  profile: string;
}

type Action =
  | { type: 'UPLOAD_PROFILE'; profile: string }
  | { type: 'UPLOAD_BACKGROUND'; background: string }
  | { type: 'REMOVE_BACKGROUND' }
  | { type: 'REMOVE_PROFILE' };

const userReducer = (state: IUserContext, action: Action) => {
  switch (action.type) {
    case 'UPLOAD_PROFILE':
      return { ...state, profile: action.profile };
    case 'UPLOAD_BACKGROUND':
      return { ...state, background: action.background };
    case 'REMOVE_BACKGROUND':
      return { ...state, background: '' };
    case 'REMOVE_PROFILE':
      return { ...state, profile: '' };
    default:
      throw new Error();
  }
};

export const UserContext = createContext({});

export const UserProvider: FunctionComponent = ({ children }): JSX.Element => {
  const [userState, dispatchUserContext] = useReducer(userReducer, {
    background: '',
    profile: '',
  });
  return <UserContext.Provider value={{ userState, dispatchUserContext }}>{children}</UserContext.Provider>;
};

export function useUser(): any {
  return useContext(UserContext);
}