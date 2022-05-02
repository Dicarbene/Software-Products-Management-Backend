delimiter //
drop trigger if exists tr_set_edition//
create trigger tr_set_edition after insert on file_content
for each row
begin
declare _if int;
declare f_id int;
set _if=0;
select _id into _if from file_edition where file_info_id=new.file_info_id;
if(_if<>0)
then
	select file_id into f_id from file_edition 
    where file_info_id=new.file_info_id and next_id=99999;
	update file_edition set next_id=new._id
    where file_id=f_id;
end if;

insert into file_edition(file_info_id,file_id)
values(new.file_info_id,new._id);

end//
delimiter ;

delimiter //
drop procedure if exists pr_view_all_edition//
create procedure pr_view_all_edition(
in f_id int
)
begin
select _id,update_time,file_url from file_content
join (select file_id,next_id from file_edition
	where file_info_id=f_id) t
    on _id=t.file_id
order by t.next_id desc;
end//
delimiter ;

delimiter //
drop procedure if exists pr_new_file//
create procedure pr_new_file(
in p_id int,
in c_id varchar(20),
in f_name varchar(45)
)
begin
declare time_now timestamp;
set time_now=current_timestamp();
insert into file_info(product_id,creator_id,file_name,latest_change_time)
values(p_id,c_id,f_name,time_now);
end//
delimiter ;

delimiter //
drop procedure if exists pr_new_content//
create procedure pr_new_content(
in f_id int,
in url varchar(200)
)
begin
declare f_name varchar(45);
declare time_now timestamp;
set time_now=current_timestamp();

select file_name into f_name from file_info where _id=f_id;
insert into file_content(file_info_id,file_url,file_name,update_time)
values(f_id,url,f_name,time_now);

update file_info set latest_change_time=time_now
where _id=f_id;
end//
delimiter ;