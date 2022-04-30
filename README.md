# Software-Products-Management-Backend
(WIP) 软件产品库-后端部分

### <p style="color: red">不要随便pull db！！！schema.prisma 存在数据库无法定义的独特功能的定义！！！</p>

### REST API

`You can access the REST API of the server using the following endpoints:`

### `GET`

- `/user=:u_log_id`

   用户名为`u_log_id`的个人主页

- `/user=:u_log_id/product=:p_name`

    用户名为`u_log_id`创建的产品名为`p_name`的产品的主要信息

- `/user=:u_log_id/product=:p_name/code=:f_name`

    用户名为`u_log_id`创建的产品名为`p_name`的产品中文件名为`f_name`的代码的迭代版本

- `/users`

    全部用户

- `/searchProduct/type=:type_of_search&q=:p_name&p=:page`
  - 搜索类型 `type_of_search`
    - `product`:搜索产品名 
    - `user`:搜索用户名 

  - 搜索类型 `p_name`
    - `product`:搜索产品名 
    - `user`:搜索用户名 

  - 分页 `page`

    搜索结果的第几页

### `POST`

- `/register`: 创建新用户
  - Body:
    - `id: String` (required): 用户的登录id
    - `email: String` (required): 用户的邮箱
    - `password: String` (required): 用户的密码
- `/login`: 用户登录
  - Body:
    - `id_or_email: String` (required): 用户的登录id或邮箱，两者任选其一输入
    - `password: String` (required): 用户的密码

- `/newProduct`: 新建项目
  - Body:
    - `p_name: String` (required): 项目名称
    - `u_id: String` (required): 创建者用户名

- `/user=:u_log_id/product=:p_name`: 关注/取消关注/收藏/取消收藏
  - Body:
    - `watcher_id: String` (required): 使用此功能的用户的用户名
    - `move_type: String` (required): 动作类型
      - `move_type==1` watch
      - `move_type==2` un_watch
      - `move_type==3` star
      - `move_type==4` un_star