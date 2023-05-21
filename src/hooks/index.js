import { useContext, useEffect, useState } from 'react';
import jwt from 'jwt-decode';
import { login as userLogin, register, editProfile } from '../api';
import { AuthContext } from '../providers/AuthProvider';
import {
  setItemInLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemFromLocalStorage,
  getItemFromLocalStorage,
} from '../utils';
import { fetchUserFriends } from '../api';
export const useAuth = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

      if (userToken) {
        const user = jwt(userToken);
        const response = await fetchUserFriends();

        let friends = [];

        if (response.success) {
          friends = response.data.friends;
        }
        setUser({
          ...user,
          friends,
        });
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const updateUser = async (userId, name, password, confirmPassword) => {
    const response = await editProfile(userId, name, password, confirmPassword);

    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const login = async (email, password) => {
    const response = await userLogin(email, password);

    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    const response = await register(name, email, password, confirmPassword);

    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const logout = () => {
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
  };

  const updateUserFriends = (addFriend, friend) => {
    if (addFriend) {
      setUser({
        ...user,
        friends: [...user.friends, friend],
      });
      return;
    }
    console.log('user', user);
    const newFriends = user.friends.filter(
      (f) => f.to_user._id !== friend.to_user._id
    );
    // const newFriends = user.friends.filter((f) => {
    //   if (
    //     f &&
    //     f.to_user &&
    //     f.to_user._id &&
    //     friend &&
    //     friend.to_user &&
    //     friend.to_user._id
    //   ) {
    //     return f.to_user._id !== friend.to_user._id;
    //   }
    //   return false;
    // });

    // const updateUserFriends = (addFriend, friend) => {
    //   if (!user || !user.friends) {
    //     return;
    //   }

    //   if (addFriend) {
    //     setUser({
    //       ...user,
    //       friends: [...user.friends, friend],
    //     });
    //     return;
    //   }

    //   const newFriends = user.friends.filter((f) => {
    //     if (
    //       f &&
    //       f.to_user &&
    //       f.to_user._id &&
    //       friend &&
    //       friend.to_user &&
    //       friend.to_user._id
    //     ) {
    //       return f.to_user._id !== friend.to_user._id;
    //     }
    //     return false;
    //   });

    //   setUser({
    //     ...user,
    //     friends: newFriends,
    //   });
    // };

    setUser({
      ...user,
      friends: newFriends,
    });
  };

  return {
    user,
    login,
    logout,
    loading,
    signup,
    updateUser,
    updateUserFriends,
  };
};
