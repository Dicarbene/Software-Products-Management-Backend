#测试注册
set @x=0;
set @y=0;
set @_if=0;
call pr_register('zzz','123456','123@126.com',@x,@y,@_if);
select @x,@y,@_if;
call pr_register('xxx','123456','123@qq.com',@x,@y,@_if);
call pr_register('xxs','123456','123d@qq.com',@x,@y,@_if);
call pr_register('xsss','123456','12ss3@qq.com',@x,@y,@_if);
call pr_register('xax','123456','14223@qq.com',@x,@y,@_if);
call pr_register('qqx','123456','1231w@qq.com',@x,@y,@_if);

call pr_logon('123aa','1234567890','@@@@',@x,@y,@_if);
select @x,@y,@_if;

#测试登录
set @__if=0;
call pr_log_on('xxx','123456',@__if);
select @__if;
call pr_log_on('12ss3@qq.com','123456',@__if);

#测试创建产品
set @___if=0;
call pr_new_product('软件测试test','zzz',@___if);

call pr_new_product('测试abc','zzz',@___if);
call pr_new_product('软件工程','zzz',@___if);
call pr_new_product('工程sb软12件','zzz',@___if);
call pr_new_product('zzzzisback','zzz',@___if);

#测试参与、收藏、查看
call pr_new_participate('zzz','软件测试test');
call pr_to_star('zzz','软件测试test');
call pr_to_watch('zzz','软件测试test');

call pr_to_watch('zzz','软件产品库');
call pr_to_watch('zzz','软件产品库');
call pr_to_watch('zzz','软件产品库');

call pr_to_star('zzz','软件产品库');

#测试多次查看
call pr_to_watch('zzz','软件测试test');

#测试取消收藏
call pr_to_unstar('zzz','软件测试test');

#测试数据统计
set @t=0;
set @l=0;
call pr_watch_info(2,@t,@l);
select @t,@l;
call pr_watch_info(3,@t,@l);
select @t,@l;

set @tt=0;
set @ll=0;
call pr_star_info(2,@tt,@ll);
select @tt,@ll;
call pr_star_info(3,@tt,@ll);
select @tt,@ll;

#测试上传文件内容
call pr_(1,'url/url');
call pr_(1,'xxx/xxx');

call pr_view_all_edition(1);