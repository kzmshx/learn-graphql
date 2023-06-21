import React from 'react';

export type CurrentUserProps = {
  name: string;
  avatar: string;
  logout: () => void;
};

const CurrentUser = ({ name, avatar, logout }: CurrentUserProps) => (
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>Logout</button>
  </div>
);

export default CurrentUser;
