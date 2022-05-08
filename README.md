# Software-Products-Management-Backend
(WIP) 软件产品库-后端部分

### <p style="color: red">不要随便pull db！！！schema.prisma 存在数据库无法定义的独特功能的定义！！！</p>

### REST API

`You can access the REST API of the server using the following endpoints:`

### `GET`

- `/user=:u_log_id`:用户信息页
  - params
    - `u_log_id`:分页

- `/user=:u_log_id/product=:p_name`:某用户创建的某仓库的信息页

  - params
    - `u_log_id`:创建者用户名
    - `p_name`:仓库名

- `/user=:u_log_id/product=:p_name/code=:f_name`:某用户创建的某仓库中某文件的迭代版本信息

  - params
    - `u_log_id`:创建者用户名
    - `p_name`:仓库名
    - `f_name`:文件名

- `/teamManagement/leader=:u_id`:leader创建的的全部项目
  - params
    - `u_id`:领队(即创建者)用户名

- `/searchProduct/type=:type_of_search&q=:p_name&p=:page`
  - params
    - `type_of_search`:搜索模式
      - `product`:搜索仓库
      - `user`: 搜索用户
    - `query`:搜索内容
    - `page`:分页

- `/user=:u_log_id/product=:p_name/coworkers`

  - params
    - `u_log_id`:用户名
    - `p_name`: 仓库名

- `/users/p=:page`: 所有用户的简略信息
  - params
    - `page`:分页

- `/products/p=:page`: 所有仓库的简略信息
  - params
    - `page`:分页

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
- `/userInfoUpdate/user=:log_id`: 更新用户信息
  - params:
    - `log_id`: 用户名
  - body:
    - `watcher_id: String`: 浏览者用户名
    - `password: String`: 修改密码
    - `email: String`: 修改邮箱
    - `pic_url: Sting`: 头像地址

- `/newProduct/creator=:u_id`: 新建项目
  - params:
    - `u_id`: 创建者用户名
  - Body:
    - `watcher_id: String` (required): 浏览者用户名
    - `p_name: String` (required): 项目名称
    - `introduction: String`: 项目简介

- `/teamManagement/leader=:u_id`:设置队友
  - params:
    - `u_id`: 创建者用户名
  - Body:
    - `watcher_id: String` (required): 浏览者用户名
    - `teammate_id: String` (required): 队友用户名
    - `p_name: String[]`: 项目名数组

- `/user=:u_log_id/product=:p_name`: 关注/取消关注/收藏/取消收藏
  - params
    - `u_log_id`:用户名
    - `p_name`:仓库名
  - Body:
    - `watcher_id: String` (required): 使用此功能的用户的用户名
    - `move_type: String` (required): 动作类型
      - `move_type==1` watch
      - `move_type==2` un_watch
      - `move_type==3` star
      - `move_type==4` un_star
      - `move_type==5` new file
    - `coworkers: String[]` (required): 协作者用户名数组
    - `f_name: String` (Optional): 新建文件名

- `/user=:u_log_id/product=:p_name/code=:f_name`: 文件上传
  - params
    - `u_log_id`: 用户名
    - `p_name`: 仓库名
    - `f_name`: 文件名
  - body
    - `watcher_id: String`(required): 浏览者用户名
    - `coworkers: String[]`(required):协作者用户名数组 
    - `file: String`(required):文件内容(长字符串)
