import React from 'react';

const UserListItem = ({ name, avatar }: { name: string; avatar: string }) => (
  <li>
    <div>
      <img src={avatar} width={48} height={48} alt="" />
      {name}
    </div>
  </li>
);

export default UserListItem;
