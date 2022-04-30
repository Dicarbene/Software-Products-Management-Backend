delimiter //
drop procedure if exists pr_new_product//
create procedure pr_new_product(
in _name varchar(45),
in u_id varchar(20),
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
    (product_name,creator_id,creator_email,creator_pic_url)
	values(_name,u_id,_e,_u);
end;
end if;
end//
delimiter ;

delimiter //
drop procedure if exists pr_new_participate//
create procedure pr_new_participate(
in u_log_id varchar(20),
in p_name varchar(45)
)
begin
insert into participation_info(u_id,p_id)values
((select _id from user_info where user_log_id=u_log_id),
(select _id from product_info where product_name=p_name));
end//
delimiter ;

delimiter //
drop procedure if exists pr_to_star//
create procedure pr_to_star(
in u_log_id varchar(20),
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
in u_log_id varchar(20),
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
in u_log_id varchar(20),
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
in u_log_id varchar(20),
in p_name varchar(45)
)
begin
delete from watch_of_product
where u_id=(select _id from user_info where user_log_id=u_log_id) 
and p_id=(select _id from product_info where product_name=p_name);
end//
delimiter ;