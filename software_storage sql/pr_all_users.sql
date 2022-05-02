delimiter //
drop procedure if exists pr_all_users//
create procedure pr_all_users()
begin
	select a._id,a.user_log_id,
	ifnull(t.s,0) get_stared_count,ifnull(t.n_p,0) product_count
	from user_info a
	left join 
	(
		select a.creator_id,count(a._id) n_p,count(distinct c._id) s
		from product_info a
		left join star_of_product c on a._id=c.p_id
		group by a.creator_id
	) t
	on a.user_log_id=t.creator_id
	order by product_count desc,get_stared_count desc,a._id asc;
end//
delimiter ;

call pr_all_users();