delimiter //
drop procedure if exists pr_all_p_of_one_u//
create procedure pr_all_p_of_one_u(
in u_log_id varchar(20)
)
begin
	select a._id,a.product_name,a.introduction,
    count(distinct c._id) w,count(distinct b._id) s
	from product_info a
	left join star_of_product b on a._id=b.p_id
    left join watch_of_product c on a._id=c.p_id
    where a.creator_id=u_log_id
	group by a._id
    order by w desc,s desc;
end//
delimiter //

call pr_all_p_of_one_u('zzz')