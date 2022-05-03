delimiter //
drop procedure if exists pr_log_in//
create procedure pr_log_in(
in u_id varchar(40),
in passwd varchar(45),
in _email varchar(45),
out existsed_id int,
out existsed_email int,
out _if tinyint
)
begin
set existsed_id=0;
set existsed_email=0;
set _if=0;
select _id into existsed_id from user_info where user_log_id=u_id;
select _id into existsed_email from user_info where email=_email;
if (existsed_id=0 and existsed_email=0)then
begin
	insert into user_info(user_log_id,password,email,create_time)
	values(u_id,passwd,_email,CURRENT_TIMESTAMP());
    set _if=1;
end;
end if;
end//
delimiter ;

delimiter //
drop procedure if exists pr_log_on//
create procedure pr_log_on(
in u_id_or_email varchar(45),
in passwd varchar(45),
out if_right int
)
begin
declare u_id int;
set if_right=0;
set u_id=0;
if exists
(select _id from user_info 
where email=u_id_or_email and password=passwd
union
select _id from user_info 
where user_log_id=u_id_or_email and password=passwd)
then
begin
	set if_right=1;
    select _id into u_id from user_info
    where user_log_id=u_id_or_email and password=passwd;
    if(u_id=0)then
		select _id into u_id from user_info
		where email=u_id_or_email and password=passwd;
    end if;
    update user_info set latest_logon=current_timestamp()
    where _id=u_id;
end;
end if;
end//
delimiter ;