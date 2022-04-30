delimiter //
drop trigger if exists tr_set_star_time//
create trigger tr_set_star_time before insert on star_of_product
for each row
begin
    set new.stared_time=CURRENT_TIMESTAMP();
end//
delimiter ;

delimiter //
drop trigger if exists tr_set_watch_time//
create trigger tr_set_watch_time before insert on watch_of_product
for each row
begin
    set new.latest_watched_time=CURRENT_TIMESTAMP();
end//
delimiter ;