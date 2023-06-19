import React from 'react';

const CurrentUser = ({ name, avatar, logout }: { name: string; avatar: string; logout: () => void }) => (
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>Logout</button>
  </div>
);

export default CurrentUser;
