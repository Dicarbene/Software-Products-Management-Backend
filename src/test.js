const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { json } = require('express/lib/response')
const res = require('express/lib/response')

const cors = require('cors')//cors解决跨域

const prisma = new PrismaClient()
const app = express()

app.use(cors())//cors解决跨域

app.use(express.json())

 app.post(`/register`, async (req, res) => {
    const { id, email, password } = req.body
    /*
    传入：
    {
      "id": "用户名",
      "email": "邮箱",
      "password": "密码"
    }
    返回：
    格式正确：
    {
        "ifExistsId": 1676,
        "ifExistsEmail": 1676,
        "ifSuccess": 0
    }
    格式不正确：
    [
    false, //用户名
    false, //邮箱
    false //密码
    ]
    */

    //try{
      
    let sIdReg = /^[a-zA-Z0-9_-]{4,16}$/;    //用户名正则，4到16位（字母，数字，下划线，减号）
    let sEmailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;  //邮箱,标准邮箱格式
    let sPasswordReg = /^[\w_-]{6,16}$/;  //密码，6到16位（大小写字母、数字、下划线、减号）

    let idValid=true
    let emailValid=true
    let passwordValid=true

    if(!sIdReg.test(id))idValid=false
    if(!sEmailReg.test(email))emailValid=false
    if(!sPasswordReg.test(password))passwordValid=false

    if(idValid&&emailValid&&passwordValid){
      let e_id=0//是否存在id，0为不存在
      let e_email=0//是否存在email，0为不存在
      let _if=0;//是否创建成功，1为成功
  
      const result = await prisma.$queryRaw`call pr_log_in(${id},${password},${email},${e_id},${e_email},${_if})`

      let arr1= JSON.parse(JSON.stringify(result[0]).replace(/f0/g,"ifExistsId"))
      let arr2= JSON.parse(JSON.stringify(arr1).replace(/f1/g,"ifExistsEmail"))
      let result_adjusted= JSON.parse(JSON.stringify(arr2).replace(/f2/g,"ifSuccess"))
  
      //console.log(result);
      res.json(result_adjusted)//或者返回其他的，或者alert再跳转
    }else{
      const x=[idValid,emailValid,passwordValid]
      res.json(x)
    }
    //}catch(error){
      //res.send('something wrong')
    //}
  })

  app.post(`/login`, async (req, res) => {
    const { id_or_email, password } = req.body
    /*
    传入：
    {
      "id_or_email": "郑宗",
      "password": "286493308郑宗1@qq.com"
    }
    传出：
    {
      "ifLogin": 0
    }
    */

    //try{
    let _if=0;//是否登录成功，1为成功

    const result = await prisma.$queryRaw`call pr_log_on(${id_or_email},${password},${_if})`

    let result_adjusted= JSON.parse(JSON.stringify(result[0]).replace(/f0/g,"ifLogin"))

    //console.log(result);
    res.json(result_adjusted)
    //}catch(error){
      //res.send('something wrong')
    //}
  })

  app.post(`/userInfoUpdate/user=:log_id`, async (req, res) => {//更改个人信息，用户名不可更改
    const { log_id } = req.params 
    const { watcher_id, password, email, pic_url} = req.body
    /*
    传入： 
    {
      "watcher_id": "zzz",
      "password": "456789",
      "email": "286493sdasdsdasd1@qq.com",
      "pic_url": "sss/xxx/sss/xxx/sss/xxx123"
    }
    修改成功：
    {
    "id": 7,
    "user_log_id": "zzz",
    "password": "456789",
    "email": "286493sdasdsdasd1@qq.com",
    "create_time": "2022-05-04T09:41:58.000Z",
    "latest_logon": "2022-04-26T10:14:44.000Z",
    "profile_pic_url": "sss/xxx/sss/xxx/sss/xxx123"
    }
    修改失败
    [
    false, //用户名
    false, //邮箱
    false //密码
    ]
    */

    //try{

      const u_info = await prisma.user_info.findUnique({
        where: { user_log_id: log_id },
      })
      if(!u_info)res.status(404)

      if(watcher_id!=log_id)res.status(404).send('you are not allowed!')

      let sIdReg = /^[a-zA-Z0-9_-]{4,16}$/;    //用户名正则，4到16位（字母，数字，下划线，减号）
      let sEmailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;  //邮箱,标准邮箱格式
      let sPasswordReg = /^[\w_-]{6,16}$/;  //密码，6到16位（大小写字母、数字、下划线、减号）
  
      let idValid=true
      let emailValid=true
      let passwordValid=true
  
      if(!sIdReg.test(id))idValid=false
      if(!sEmailReg.test(email))emailValid=false
      if(!sPasswordReg.test(password))passwordValid=false

      if(idValid&&emailValid&&passwordValid){
        const result = await prisma.user_info.update({
          where: {
            user_log_id: log_id,
          },
          data: {
            password: password,
            email: email,
            profile_pic_url: pic_url,
          },
        })
        res.json(result)
        //console.log(result);
      }else{
        const x=[idValid,emailValid,passwordValid]
        res.json(x)
      }
    //}catch(error){
      //res.send('something wrong')
    //}
  })

  app.post(`/newProduct/creator=:u_id`, async (req, res) => {
    const { u_id } = req.params
    const { watcher_id, p_name, introduction  } = req.body
    /*
    传入：
    {
      "watcher_id": "zzz",
      "p_name": "没分布式的版本管理",
      "introduction": "zzz&wxj&ls"
    }
    传出：
    {
      "ifCreateOk": 0
    }
    */

    //try{
      const u_info = await prisma.user_info.findUnique({
        where: { user_log_id: u_id },
      })
      if(!u_info)res.status(404)

      if(watcher_id!=u_id)res.status(404).send('you are not allowed!')

    let _if=0;//是否存在同名，0为不存在，即成功创建

    const result = await prisma.$queryRaw`call pr_new_product(${p_name},${introduction},${u_id},${_if})`
    let result_adjusted= JSON.parse(JSON.stringify(result[0]).replace(/f0/g,"ifCreateOk"))

    //console.log(result);
    res.json(result_adjusted)
    //}catch(error){
      //res.send('something wrong')
    //}
  })

  app.get(`/teamManagement/leader=:u_id`, async (req, res) => {//参与进项目：显示管理者的所有项目
    const { u_id } = req.params
    /*
    传出：
    [
      {
        "id": 2,
        "product_name": "软件测试test"
      },
      {
        "id": 3,
        "product_name": "软件产品库"
      },
      ...
    ]
    */
    //try{
    const result = await prisma.product_info.findMany({
      where: {creator_id: u_id, },
      select: {
        id: true,
        product_name: true, 
      },
    })

    res.json(result)
    //}catch(error){
      //res.send('something wrong')
    //}
  })

  app.post(`/teamManagement/leader=:u_id`, async (req, res) => {//参与进项目：设置队友
    const { u_id } = req.params
    const { watcher_id, teammate_id ,p_name } = req.body

    //try{
      const u_info = await prisma.user_info.findUnique({
        where: { user_log_id: u_id },
      })
      if(!u_info)res.status(404)//若查无此人，404

      if(watcher_id!=u_id)res.status(404).send('you are not allowed!')//浏览者不是leader，无资格

      const id_result = await prisma.user_info.findUnique({
        where: {user_log_id: teammate_id, },
      })
      if(!id_result)res.send('查无此人！')

      let i=new Number
      let name_arr
      let result=new Array

      for(i=0;i<p_name.length;i++){
        //try{
          name_arr=p_name[i];
          result[i]=await prisma.$queryRaw`call pr_new_participate(${teammate_id},${watcher_id},${name_arr})`
          result[i]=result[i][0]
        //}catch(error){
          //res.send('something wrong')
        }
        let result_adjusted= JSON.parse(JSON.stringify(result).replace(/f0/g,"participationState"))
        const x=[p_name,result_adjusted]

      res.json(x)

        
    //}catch(error){
      //res.send('something wrong')
    //}
  })

  app.get(`/user=:u_log_id`, async (req, res) => {//用户信息
    const { u_log_id } = req.params
  /* 
  [
    {
        "id": 7,
        "user_log_id": "zzz",
        "email": "286493sdasdsdasd1@qq.com",
        "create_time": "2022-05-04T09:41:58.000Z",
        "latest_logon": "2022-04-26T10:14:44.000Z",
        "profile_pic_url": "sss/xxx/sss/xxx/sss/xxx123"
    },//信息
    [
        {
            "id": 2,
            "productName": "软件测试test",
            "introduction": "",
            "totalWatched": 4,
            "totalStared": 1
        },
        {
            "id": 3,
            "productName": "软件产品库",
            "introduction": "",
            "totalWatched": 3,
            "totalStared": 1
        },
        ... //所有的仓库
    ],
    [
        {
            "recentWatchedProduct": "软件测试test",
            "watchTime": "2022-05-04T09:04:00+00:00"
        },
        {
            "recentWatchedProduct": "软件产品库",
            "watchTime": "2022-05-04T09:04:00+00:00"
        },
        ... //最近watch了那些项目
    ],
    [
        {
            "recentStaredProduct": "软件产品库",
            "StarTime": "2022-05-04T09:04:00+00:00"
        },
        {
            "recentStaredProduct": "ww",
            "StarTime": "2022-05-04T09:04:00+00:00"
        },
        ... //最近star了哪些项目
    ]
  ]
  */
    //try{
      const u_info = await prisma.user_info.findUnique({
      where: { user_log_id: u_log_id },
      select: { 
        id: true,
        user_log_id: true,
        email: true,
        create_time: true,
        latest_logon: true,
        profile_pic_url: true,
        password: false,
      },
    })

    if(!u_info)res.status(404)

      const p_of_this_u = await prisma.$queryRaw`call pr_all_p_of_one_u(${u_log_id})`

      let arr1= JSON.parse(JSON.stringify(p_of_this_u).replace(/f0/g,"id"))
      let arr2= JSON.parse(JSON.stringify(arr1).replace(/f1/g,"productName"))
      let arr3= JSON.parse(JSON.stringify(arr2).replace(/f2/g,"introduction"))
      let arr4= JSON.parse(JSON.stringify(arr3).replace(/f3/g,"totalWatched"))
      let p_of_this_u_adj= JSON.parse(JSON.stringify(arr4).replace(/f4/g,"totalStared"))

      const watched = await prisma.$queryRaw`call pr_recent_watch(${u_info.id})`
      const stared = await prisma.$queryRaw`call pr_recent_star(${u_info.id})`

      let arr= JSON.parse(JSON.stringify(watched).replace(/f0/g,"recentWatchedProduct"))
      let watched_adj= JSON.parse(JSON.stringify(arr).replace(/f1/g,"watchTime"))
      let ARR= JSON.parse(JSON.stringify(stared).replace(/f0/g,"recentStaredProduct"))
      let stared_adj= JSON.parse(JSON.stringify(ARR).replace(/f1/g,"StarTime"))

      const x=[u_info,p_of_this_u_adj,watched_adj,stared_adj]

      res.json(x)
    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.get(`/user=:u_log_id/product=:p_name`, async (req, res) => {//产品信息
    const { u_log_id ,p_name }=req.params
      //try{
  /* 
  传出：
  [
    {
        "id": 2,
        "product_name": "软件测试test",
        "introduction": "",
        "creator_id": "zzz",
        "creator_email": "123@126.com",
        "creator_pic_url": "sss/xxx/sss/xxx/sss/xxx123"
    }, //信息
    {
        "totalWatch": 4,
        "7daysRecentWatch": 4
    }, //watch情况
    {
        "totalStar": 1,
        "7daysRecentStar": 1
    }, //star情况
    [
        {
            "id": 1,
            "product_id": 2,
            "creator_log_id": "zzz",
            "file_name": "file_test",
            "latest_change_time": "2022-04-27T09:45:54.000Z"
        },
        ... //全部文件信息
    ]
  ]
  */
        const u_info = await prisma.user_info.findUnique({
          where: { user_log_id: u_log_id },
        })
    
        if(!u_info)res.status(404)

        const p_info = await prisma.product_info.findUnique({
          where: { 
            NameAndId:{
              product_name: p_name,
              creator_id: u_log_id,
            },
          },
        })
    
        if(!p_info)res.status(404)

      let w_t,w_7,s_t,s_7

      const result_watch = await prisma.$queryRaw`call pr_watch_info(${p_info.id},${w_t},${w_7})`
      const result_star = await prisma.$queryRaw`call pr_star_info(${p_info.id},${s_t},${s_7})`
      //所有的存储过程调用语句都返回一个数组
      //此处的两个info数组只有一项[0]，其中两项f0,f1 分别是总数和过去七天

      let arr1= JSON.parse(JSON.stringify(result_watch[0]).replace(/f0/g,"totalWatch"))
      let result_watch_adjusted= JSON.parse(JSON.stringify(arr1).replace(/f1/g,"7daysRecentWatch"))
      let arr2= JSON.parse(JSON.stringify(result_star[0]).replace(/f0/g,"totalStar"))
      let result_star_adjusted= JSON.parse(JSON.stringify(arr2).replace(/f1/g,"7daysRecentStar"))
      //改变json属性名称，同时把json数组取消掉（prisma转化原生sql语句为数组，此处的数组只有第0项）    

      
      const all_file = await prisma.file_info.findMany({
        where: { product_id: p_info.id, },
      })

      const x=[p_info,result_watch_adjusted,result_star_adjusted,all_file]//product_info已有冗余列，不需要返回u_info
      res.json(x)
    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.post(`/user=:u_log_id/product=:p_name`, async (req, res) => {//关注、点赞、新建文件
    const { u_log_id ,p_name }=req.params
    const { watcher_id ,move_type, coworkers, f_name}=req.body//f_name只有在move=5时才应当被接收
      //try{

      /*
      传入：
      {
        "watcher_id": "qqx",
        "move_type": 1,
        "coworkers": [
          "xxx",
          "zzz"
        ],  //u_log_id的coworker数组
        "f_name": "file_test"
      }
      */

        const u_info = await prisma.user_info.findUnique({
          where: { user_log_id: u_log_id },
        })
    
        if(!u_info)res.status(404)

        const p_info = await prisma.product_info.findUnique({
          where: { 
            NameAndId:{
              product_name: p_name,
              creator_id: u_log_id,
            }
          },
        })
    
        if(!p_info)res.status(404)
        
      //move_type:
      //1:watch
      //2:unwatch
      //3:star
      //4:un_star
      //5:new file
       if(move_type==1){
        await prisma.$queryRaw`call pr_to_watch(${watcher_id},${p_name})`
        res.send('关注成功')
        //alert('关注成功')，应当修改
       }
       else if(move_type==2){
        await prisma.$queryRaw`call pr_to_unwatch(${watcher_id},${p_name})`
        res.send('取消关注')
        //alert('取消关注')
       }
       else if(move_type==3){
        await prisma.$queryRaw`call pr_to_star(${watcher_id},${p_name})`
        res.send('收藏成功')
        //alert('收藏成功')
       }
       else if(move_type==4){
        await prisma.$queryRaw`call pr_to_unstar(${watcher_id},${p_name})`
        res.send('取消收藏')
        //alert('取消收藏')
       }
       else if(move_type==5){
        
        function checkIfIn(coworkers) {//findIndex方法的判断函数
          return coworkers == watcher_id;
        }
          if (coworkers.findIndex(checkIfIn)==-1)res.send('you have on right to create file')//应当修改
          else{
            const f_info = await prisma.file_info.findUnique({
              where: { 
                PidAndFname: {
                  product_id: p_info.id,
                  file_name: f_name,
                }
              },
            })
            if(f_info)res.send('already have a file in the same name!')//判断同名，应当修改
            else{
              await prisma.$queryRaw`call pr_new_file(${p_info.id},${watcher_id},${f_name})`
              res.send('创建成功')
              //跳到./code
            }
          }
        }
       else res.status(404)

    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.get(`/user=:u_log_id/product=:p_name/coworkers`, async (req, res) => {//一个仓库的所有协作者
    const { u_log_id ,p_name }=req.params
      //try{
        /*
        返回：
        [
        "xxx",
        "zzz"
        ]
        */
        const u_info = await prisma.user_info.findUnique({
          where: { user_log_id: u_log_id },
        })
    
        if(!u_info)res.status(404)

        const p_info = await prisma.product_info.findUnique({
          where: { 
            NameAndId:{
              product_name: p_name,
              creator_id: u_log_id,
            },
          },
        })
    
        if(!p_info)res.status(404)

        const coworkers_info = await prisma.participation_info.findMany({
          where: { p_id: p_info.id },
        })

        let i=new Number
        let userHaveRight=new Array
        for(i=0;i<coworkers_info.length;i++){
          userHaveRight[i] = await prisma.user_info.findUnique({
            where: { id: coworkers_info[i].u_id},
            select: {
              user_log_id: true,
            }
          })
        }

        const creator = await prisma.user_info.findUnique({
          where: { user_log_id: u_log_id },
          select: {
            user_log_id: true,
          }
        })

        userHaveRight.push(creator)
        let ans = [];
        for(let i = 0;i<userHaveRight.length;++i) ans.push(userHaveRight[i]["user_log_id"]);
        res.json(ans)

    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.get(`/user=:u_log_id/product=:p_name/code=:f_name`, async (req, res) => {//文件信息
    const { u_log_id, p_name, f_name } = req.params

    //try{

    /*
    传入：
    {
      "u_log_id": "zzz",
      "p_name": "软件测试test",
      "f_name": test_file
    }
    */
      const u_info = await prisma.user_info.findUnique({
        where: { user_log_id: u_log_id },
      })
  
      if(!u_info)res.status(404)

      const p_info = await prisma.product_info.findUnique({
        where: { 
          NameAndId:{
            product_name: p_name,
            creator_id: u_log_id,
          }
        },
      })
  
      if(!p_info)res.status(404)

      const f_info = await prisma.file_info.findUnique({
        where: { 
          PidAndFname: {
            product_id: p_info.id,
            file_name: f_name,
          }
        },
      })
      //res.json(f_info)
  
      if(!f_info)res.status(404)

    let w_t,w_7,s_t,s_7

    const result_watch = await prisma.$queryRaw`call pr_watch_info(${p_info.id},${w_t},${w_7})`
    const result_star = await prisma.$queryRaw`call pr_star_info(${p_info.id},${s_t},${s_7})`
    //所有的存储过程调用语句都返回一个数组
    //此处的两个info数组只有一项[0]，其中两项f0,f1 分别是总数和过去七天

    let single1= JSON.parse(JSON.stringify(result_watch[0]).replace(/f0/g,"totalWatch"))
    let result_watch_adjusted= JSON.parse(JSON.stringify(single1).replace(/f1/g,"7daysRecentWatch"))
    let single2= JSON.parse(JSON.stringify(result_star[0]).replace(/f0/g,"totalStar"))
    let result_star_adjusted= JSON.parse(JSON.stringify(single2).replace(/f1/g,"7daysRecentStar"))
    //改变json属性名称，同时把json数组取消掉（prisma转化原生sql语句为json数组，此处的数组只有第0项）
      
      const all_edition = await prisma.$queryRaw`call pr_view_all_edition(${f_info.id})`

      let arr1= JSON.parse(JSON.stringify(all_edition).replace(/f0/g,"id"))
      let arr2= JSON.parse(JSON.stringify(arr1).replace(/f1/g,"changedTime"))
      let all_edition_adjusted= JSON.parse(JSON.stringify(arr2).replace(/f2/g,"url"))

      const x=[p_info,result_watch_adjusted,result_star_adjusted,all_edition_adjusted]//product_info已有冗余列，不需要返回u_info
      res.json(x)
    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.post(`/user=:u_log_id/product=:p_name/code=:f_name`, async (req, res) => {//文件上传
    const { u_log_id, p_name, f_name } = req.params
    const { watcher_id, coworkers, file} = req.body

    /*
    传入：
    {
      "watcher_id": "zzz",
      "coworkers": [
        "xxx",
        "zzz"
      ],
      "file": "大字符串"
    }
    */

    //try{
      const u_info = await prisma.user_info.findUnique({
        where: { user_log_id: watcher_id },
      })
  
      if(!u_info)res.status(404)

      const p_info = await prisma.product_info.findUnique({
        where: { 
          NameAndId:{
            product_name: p_name,
            creator_id: u_log_id,
          }
        },
      })
  
      if(!p_info)res.status(404)

      const f_info = await prisma.file_info.findUnique({
        where: { 
          PidAndFname: {
            product_id: p_info.id,
            file_name: f_name,
          }
        },
      })
      //res.json(f_info)
  
      if(!f_info)res.status(404)

      function checkIfIn(coworkers) {//findIndex方法的判断函数
        return coworkers == watcher_id;
      }
        if (coworkers.findIndex(checkIfIn)==-1)res.send('you have no right to update file')//应当修改
        else{
          await prisma.$queryRaw`call pr_new_content(${f_info.id},${file})`
          res.send('update successfully')//应当修改
        }
    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.get(`/searchProduct/type=:type_of_search&q=:query&p=:page`, async (req, res) => {//基于全文索引的简单搜索
    const { query, type_of_search, page } = req.params

    //try{

    /*
    传出：搜product
    [
      {
        "totalNum": 3
      },
      {
        "outOfRange": 0
      },
      [
        {
            "id": 2,
            "productName": "软件测试test",
            "creator": "zzz",
            "introduction": "",
            "totalWatch": 5,
            "totalStar": 1
        },
        {
            "id": 3,
            "productName": "软件产品库",
            "creator": "zzz",
            "introduction": "",
            "totalWatch": 3,
            "totalStar": 1
        }
      ]
    ]
    搜user：
    [
      {
        "totalNum": 58
      },
      {
        "outOfRange": 0
      },
      [
        {
            "id": 736,
            "userId": "Walker.Kerluke",
            "email": "Kamron_Walker60@gmail.com",
            "picUrl": null
        },
        {
            "id": 1491,
            "userId": "Dereck_Kerluke87",
            "email": "Jake18@gmail.com",
            "picUrl": null
        }
      ]
    ]
    */

    let adjusted_page=parseInt(page)

    if(adjusted_page<=0)adjusted_page = 1;//处理所有负数据和0，定为第一页

    let n_//必须的传值手段，定义而不用

    let i,l,width=new Number;

    width=2;//设置一页有多少条搜索结果

    let all_result=new Array;
    let n=new Number;
    let limited_result=new Array;

    if(type_of_search=='product'){
      all_result = await prisma.$queryRaw`call pr_search_p(${query})`
      n=all_result.length
      //n = await prisma.$queryRaw`call pr_how_many_results_p(${p_name},${n_})`
    //所有的存储过程调用语句都返回一个数组
    }
    else if(type_of_search=='user'){
      all_result = await prisma.$queryRaw`call pr_search_u(${query})`
      n=all_result.length
      //n = await prisma.$queryRaw`call pr_how_many_results_u(${p_name},${n_})`
    //所有的存储过程调用语句都返回一个数组
    }
    else res.status(404);

    l=0;i=0;

    for(i=(adjusted_page-1)*width;i<=adjusted_page*width-1;i++){
      limited_result[l]=all_result[i];
      l++;
    }

    let if_out = 0
    if(limited_result[0]==null){//判断是否没有找到更多内容
      if_out = 1
    }
    let x_if_out = if_out + "";
    let str_if_out = '{"outOfRange":' + x_if_out + '}';
    let outOfRange = JSON.parse(str_if_out);  //数字转化JSON格式

    let limited_result_adjusted=new Array

    if(type_of_search=='product'){
      let arr1= JSON.parse(JSON.stringify(limited_result).replace(/f0/g,"id"))
      let arr2= JSON.parse(JSON.stringify(arr1).replace(/f1/g,"productName"))
      let arr3= JSON.parse(JSON.stringify(arr2).replace(/f2/g,"creator"))
      let arr4= JSON.parse(JSON.stringify(arr3).replace(/f3/g,"introduction"))
      let arr5= JSON.parse(JSON.stringify(arr4).replace(/f4/g,"totalWatch"))
      limited_result_adjusted= JSON.parse(JSON.stringify(arr5).replace(/f5/g,"totalStar"))
      //更改属性名
    }
    else if(type_of_search=='user'){
      let arr1= JSON.parse(JSON.stringify(limited_result).replace(/f0/g,"id"))
      let arr2= JSON.parse(JSON.stringify(arr1).replace(/f1/g,"userId"))
      let arr3= JSON.parse(JSON.stringify(arr2).replace(/f2/g,"email"))
      limited_result_adjusted= JSON.parse(JSON.stringify(arr3).replace(/f3/g,"picUrl"))
    }

    let t = n + "";
    let str = '{"totalNum":'+t+'}';
    let total = JSON.parse(str);  //数字转化JSON格式

    const x=[total,outOfRange,limited_result_adjusted]//应当判断limited_result[0]是否为空，空则显示没有更多信息

    res.json(x)
    //}catch(error){
      //res.send('something wrong')
    //}
  })


app.get('/users/p=:page', async (req, res) => {
  const  {page }=req.params

/*
  [
    {
        "totalNum": 1021
    },
    {
        "outOfRange": 0
    },
    [
        {
            "id": 7,
            "userLogId": "zzz",
            "starsCount": 2,
            "productsCount": 9
        },
        {
            "id": 839,
            "userLogId": "Pat.Sporer61",
            "starsCount": 0,
            "productsCount": 5
        }
    ]
  ]
*/

  //try{
  let adjusted_page=parseInt(page)

  if(adjusted_page<=0)adjusted_page = 1;//处理所有负数据和0，定为第一页

  let n_//必须的传值手段，定义而不用

  let i,l,width=new Number;

  width=12;//设置一页有多少条搜索结果

  let all_result=new Array;
  let n=new Number;
  let limited_result=new Array;

  all_result = await prisma.$queryRaw`call pr_all_users()`
  n=all_result.length

  l=0;i=0;

    for(i=(adjusted_page-1)*width;i<=adjusted_page*width-1;i++){
      limited_result[l]=all_result[i];
      l++;
    }
    let if_out = 0
    if(limited_result[0]==null){//判断是否没有找到更多内容
      if_out = 1
    }
    let x_if_out = if_out + "";
    let str_if_out = '{"outOfRange":' + x_if_out + '}';
    let outOfRange = JSON.parse(str_if_out);  //数字转化JSON格式

    let arr1= JSON.parse(JSON.stringify(limited_result).replace(/f0/g,"id"))
    let arr2= JSON.parse(JSON.stringify(arr1).replace(/f1/g,"userLogId"))
    let arr3= JSON.parse(JSON.stringify(arr2).replace(/f2/g,"starsCount"))
    let arr4= JSON.parse(JSON.stringify(arr3).replace(/f3/g,"productsCount"))
    let limited_result_adjusted= JSON.parse(JSON.stringify(arr4).replace(/f4/g,"profilePicUrl"))
    //更改属性名

    let t = n + "";
    let str = '{"totalNum":'+t+'}';
    let total = JSON.parse(str);  //数字转化JSON格式

    const x=[total,outOfRange,limited_result_adjusted]//应当判断limited_result[0]是否为空，空则显示没有更多信息
    res.json(x)
  //}catch(error){
    //res.send('something wrong')
  //}
})

app.get('/products/p=:page', async (req, res) => {
  const  { page }=req.params

  /*
  [
    {
        "totalNum": 1021
    },
    {
        "outOfRange": 0
    },
    [
        {
            "id": 2,
            "productName": "软件测试test",
            "creator": "zzz",
            "introduction": "",
            "totalWatch": 5,
            "totalStar": 1
        },
        {
            "id": 3,
            "productName": "软件产品库",
            "creator": "zzz",
            "introduction": "",
            "totalWatch": 3,
            "totalStar": 1
        }
    ]
  ] 
  */

  //try{
  let adjusted_page=parseInt(page)

  if(adjusted_page<=0)adjusted_page = 1;//处理所有负数据和0，定为第一页

  let n_//必须的传值手段，定义而不用

  let i,l,width=new Number;

  width=16;//设置一页有多少条搜索结果

  let all_result=new Array;
  let n=new Number;
  let limited_result=new Array;

  all_result = await prisma.$queryRaw`call pr_all_products()`
  n=all_result.length

  l=0;i=0;

    for(i=(adjusted_page-1)*width;i<=adjusted_page*width-1;i++){
      limited_result[l]=all_result[i];
      l++;
    }

    let if_out = 0
    if(limited_result[0]==null){//判断是否没有找到更多内容
      if_out = 1
    }
    let x_if_out = if_out + "";
    let str_if_out = '{"outOfRange":' + x_if_out + '}';
    let outOfRange = JSON.parse(str_if_out);  //数字转化JSON格式

    let arr1= JSON.parse(JSON.stringify(limited_result).replace(/f0/g,"id"))
    let arr2= JSON.parse(JSON.stringify(arr1).replace(/f1/g,"productName"))
    let arr3= JSON.parse(JSON.stringify(arr2).replace(/f2/g,"creator"))
    let arr4= JSON.parse(JSON.stringify(arr3).replace(/f3/g,"introduction"))
    let arr5= JSON.parse(JSON.stringify(arr4).replace(/f4/g,"totalWatch"))
    let limited_result_adjusted= JSON.parse(JSON.stringify(arr5).replace(/f5/g,"totalStar"))
    //更改属性名
    
    let t = n + "";
    let str = '{"totalNum":'+t+'}';
    let total = JSON.parse(str);  //数字转化JSON格式

    const x=[total,outOfRange,limited_result_adjusted]//应当判断limited_result[0]是否为空，空则显示没有更多信息
    res.json(x)
  //}catch(error){
    //res.send('something wrong')
  //}
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)