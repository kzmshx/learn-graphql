create table if not exists Links
(
  ID      int not null unique auto_increment,
  Title   varchar(255),
  Address varchar(255),
  UserID  int,
  foreign key (UserID) references Users (ID),
  primary key (ID)
)
