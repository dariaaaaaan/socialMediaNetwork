create table users(
	id serial primary key, 
	email text,
	password text,
	name text,
	restaurant text,
	phone text
);

create table locations(
	id serial primary key,
	rid int references users(id),
	address text,
	city text,
	province text
);