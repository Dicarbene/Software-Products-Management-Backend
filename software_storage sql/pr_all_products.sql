delimiter //
drop procedure if exists pr_all_products//
create procedure pr_all_products()
begin
select a._id,a.product_name,a.creator_id,a.introduction,
    ifnull(b.n_w,0) n_of_w,ifnull(c.n_s,0) n_of_s 
    from
		(
        select _id,product_name,creator_id,introduction 
        from product_info
        ) a 
        left join
        (
        select ta.p_id,count(ta._id) n_w from watch_of_product ta
        join product_info tb on ta.p_id=tb._id
        group by p_id
        ) b on a._id=b.p_id
        left join
        (
        select ta.p_id,count(ta._id) n_s from star_of_product ta
        join product_info tb on ta.p_id=tb._id
        group by p_id
        ) c on a._id=c.p_id;
end//
delimiter ;

call pr_all_products();