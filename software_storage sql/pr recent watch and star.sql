delimiter //
drop procedure if exists pr_recent_watch//
create procedure pr_recent_watch(
in uid int
)
begin
select product_name,max(latest_watched_time)
from product_info a inner join watch_of_product b on a._id=b.p_id
where b.u_id=uid
group by product_name;
end//
delimiter ;

delimiter //
drop procedure if exists pr_recent_star//
create procedure pr_recent_star(
in uid int
)
begin
select product_name,max(stared_time)
from product_info a inner join star_of_product b on a._id=b.p_id
where b.u_id=uid
group by product_name;
end//
delimiter ;