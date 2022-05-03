delimiter //
drop procedure if exists pr_new_product//
create procedure pr_new_product(
in _name varchar(45),
in introduct varchar(100),
in u_id varchar(40),
out if_exists int
)
begin
declare _e varchar(45);
declare _u varchar(200);
set if_exists=0;
select _id into if_exists from product_info where product_name=_name;
if(if_exists=0)then
begin
	select email into _e from user_info where user_log_id=u_id;
	select profile_pic_url into _u from user_info where user_log_id=u_id;
	insert into product_info
    (product_name,introduction,creator_id,creator_email,creator_pic_url)
	values(_name,introduct,u_id,_e,_u);
end;
end if;
end//
delimiter ;

delimiter //
drop procedure if exists pr_new_participate//
create procedure pr_new_participate(
in u_log_id varchar(40),
in c_log_id varchar(40),
in p_name varchar(45)
)
begin
declare _u_id int;
declare _p_id int;

select _id into _u_id from user_info where user_log_id=u_log_id;
select _id into _p_id from product_info 
where creator_id=c_log_id and product_name=p_name;

if not exists
(select _id from participation_info where u_id=_u_id and p_id=_p_id)
then begin
insert into participation_info(u_id,p_id)values
(_u_id,_p_id);
select 'ok';
end;
else select'already exists!';
end if;
end//
delimiter ;

#call pr_new_participate('xxx','zzz','软件测试test');

delimiter //
drop procedure if exists pr_to_star//
create procedure pr_to_star(
in u_log_id varchar(40),
in p_name varchar(45)
)
begin
insert into star_of_product(u_id,p_id)values
((select _id from user_info where user_log_id=u_log_id),
(select _id from product_info where product_name=p_name));
end//
delimiter ;

delimiter //
drop procedure if exists pr_to_unstar//
create procedure pr_to_unstar(
in u_log_id varchar(40),
in p_name varchar(45)
)
begin
delete from star_of_product
where u_id=(select _id from user_info where user_log_id=u_log_id) 
and p_id=(select _id from product_info where product_name=p_name);
end//
delimiter ;

delimiter //
drop procedure if exists pr_to_watch//
create procedure pr_to_watch(
in u_log_id varchar(40),
in p_name varchar(45)
)
begin
insert into watch_of_product(u_id,p_id)values
((select _id from user_info where user_log_id=u_log_id),
(select _id from product_info where product_name=p_name));
end//
delimiter ;

delimiter //
drop procedure if exists pr_to_unwatch//
create procedure pr_to_unwatch(
in u_log_id varchar(40),
in p_name varchar(45)
)
begin
delete from watch_of_product
where u_id=(select _id from user_info where user_log_id=u_log_id) 
and p_id=(select _id from product_info where product_name=p_name);
end//
delimiter ;