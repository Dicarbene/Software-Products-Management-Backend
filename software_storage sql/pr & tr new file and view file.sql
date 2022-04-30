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
select _id,file_url,file_name from file_content
join (select file_id,next_id from file_edition
	where file_info_id=f_id) t
    on _id=t.file_id
order by t.next_id desc;
end//
delimiter ;

delimiter //
drop procedure if exists pr_//
create procedure pr_(
in f_id int,
in url varchar(200)
)
begin
declare f_name varchar(45);

select file_name into f_name from file_info where _id=f_id;
insert into file_content(file_info_id,file_url,file_name)
values(f_id,url,f_name);

update file_info set latest_change_time=current_timestamp()
where _id=f_id;
end//
delimiter ;