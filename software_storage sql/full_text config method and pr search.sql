#设置全文索引表源 格式： 库/表
SET GLOBAL innodb_ft_aux_table = 'software_storage/product_info';
#查看之
show variables like 'innodb_ft_aux_table';
#查看分词效果
SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE;
#执行optimize之后会伪存盘入INNODB_FT_INDEX_TABLE
#先设置innodb_optimize_fulltext_only参数
SET GLOBAL innodb_optimize_fulltext_only=ON;
#optimize
optimize  table product_info;
#查看伪存盘情况，运行情况下不建议查询
SELECT * FROM information_schema.INNODB_FT_INDEX_TABLE;
#查看停止词：
#mysql认为停止词在这个世界上存在的太多了，毁灭吧，烦了
#也就是说mysql不会match可能大量出现并导致命中率极高的词
SELECT * FROM information_schema.INNODB_FT_DEFAULT_STOPWORD;
#可以手动添加、修改甚至全部禁用，但没必要

#查看最小&大搜索长度、ngram分词长度
select @@innodb_ft_min_token_size;
select @@ft_min_word_len;
select @@ngram_token_size;

#更改配置文件之后一定要执行下面语句，否则参数不生效
#repair table product_info quick;
delimiter //
drop procedure if exists pr_search//
create procedure pr_search(
in p_name varchar(45)
)
begin
	declare no_ci varchar(45);
    declare ci varchar(45);
    set no_ci=concat(Num_char_extract(p_name,2),'*');
    set ci=Num_char_extract(p_name,3);
		select _id,product_name,creator_id 
        from product_info
		where match(product_name) against(no_ci in boolean mode)
		union
		select _id,product_name,creator_id
        from product_info
		where match(product_name) against(ci);
end//
delimiter //

delimiter //
drop procedure if exists pr_how_many_results//
create procedure pr_how_many_results(
in p_name varchar(45),
out n int
)
begin
	declare no_ci varchar(45);
    declare ci varchar(45);
    set no_ci=concat(Num_char_extract(p_name,2),'*');
    set ci=Num_char_extract(p_name,3);
	select count(_id) into n from
    (
		select _id,product_name,creator_id 
        from product_info
		where match(product_name) against(no_ci in boolean mode)
		union
		select _id,product_name,creator_id
        from product_info
		where match(product_name) against(ci)
    ) t;
end//
delimiter //

set @x=0;
call pr_how_many_results('tes软件',@x);
select @x;