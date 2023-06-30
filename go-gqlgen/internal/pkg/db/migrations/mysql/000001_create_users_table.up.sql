create table if not exists Users
(
  ID       int          not null unique auto_increment,
  Username varchar(127) not null unique,
  Password varchar(127) not null,
  primary key (ID)
)
