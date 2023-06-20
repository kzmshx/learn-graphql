import React from 'react';

export type UserListItemProps = {
  name: string;
  avatar: string;
};

const UserListItem = ({ name, avatar }: UserListItemProps) => (
  <li>
    <div>
      <img src={avatar} width={48} height={48} alt="" />
      {name}
    </div>
  </li>
);

export default UserListItem;
