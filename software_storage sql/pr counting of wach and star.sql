delimiter //
drop procedure if exists pr_watch_info//
create procedure pr_watch_info(
in _p_id int,
out total int,
out last_seven_days int
)
begin
declare stamp_now timestamp;
set stamp_now=current_timestamp();
set total=0;
set last_seven_days=0;

select count(_id) into total from watch_of_product 
where p_id=_P_id group by p_id;

select count(_id) into last_seven_days from watch_of_product 
where p_id=_P_id group by p_id and
latest_watched_time>=(stamp_now-interval '7' day);
end//
delimiter ;

delimiter //
drop procedure if exists pr_star_info//
create procedure pr_star_info(
in _p_id int,
out total int,
out last_seven_days int
)
begin
declare stamp_now timestamp;
set stamp_now=current_timestamp();
set total=0;
set last_seven_days=0;

select count(_id) into total from star_of_product 
where p_id=_P_id group by p_id;

select count(_id) into last_seven_days from star_of_product
where p_id=_P_id group by p_id and
stared_time>=(stamp_now-interval '7' day);
end//
delimiter ;