delimiter //
drop trigger if exists tr_update_u_info//
create trigger tr_update_u_info before update on user_info
for each row
begin
update product_info set creator_pic_url=new.profile_pic_url
where creator_id=new.user_log_id;
end//
delimiter ;