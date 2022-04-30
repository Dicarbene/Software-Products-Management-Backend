const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { json } = require('express/lib/response')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

 app.post(`/register`, async (req, res) => {
    const { id, email, password } = req.body

    var e_id=0//是否存在id，0为不存在
    var e_email=0//是否存在email，0为不存在
    var _if=0;//是否创建成功，1为成功

    const result = await prisma.$queryRaw`call pr_log_in(${id},${password},${email},${e_id},${e_email},${_if})`

    console.log(result);
    res.json(result)
  })

  app.post(`/login`, async (req, res) => {
    const { id_or_email, password } = req.body

    var _if=0;//是否登录成功，1为成功

    const result = await prisma.$queryRaw`call pr_log_on(${id_or_email},${password},${_if})`

    console.log(result);
    res.json(result)
  })

  app.post(`/newProduct`, async (req, res) => {
    const { p_name, u_id } = req.body

    var _if=0;//是否存在同名，0为不存在，即成功创建

    const result = await prisma.$queryRaw`call pr_new_product(${p_name},${u_id},${_if})`

    console.log(result);
    res.json(result)
  })

  app.get(`/user=:u_log_id`, async (req, res) => {//用户信息
    const { u_log_id } = req.params

    //try{
      const u_info = await prisma.user_info.findUnique({
      where: { user_log_id: u_log_id },
    })

    if(u_info==null)res.status(404)

      const watched = await prisma.$queryRaw`call pr_recent_watch(${u_info.id})`
      const stared = await prisma.$queryRaw`call pr_recent_star(${u_info.id})`

      const x=[u_info,watched,stared]

      res.json(x)
    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.get(`/user=:u_log_id/product=:p_name`, async (req, res) => {//产品信息
    const { u_log_id ,p_name }=req.params
      //try{

        const u_info = await prisma.user_info.findUnique({
          where: { user_log_id: u_log_id },
        })
    
        if(u_info==null)res.status(404)

        const p_info = await prisma.product_info.findUnique({
          where: { 
            NameAndId:{
              product_name: p_name,
              creator_id: u_log_id,
            }
          },
        })
    
        if(p_info==null)res.status(404)

      var w_t,w_7,s_t,s_7

      const result_watch = await prisma.$queryRaw`call pr_watch_info(${p_info.id},${w_t},${w_7})`
      const result_star = await prisma.$queryRaw`call pr_star_info(${p_info.id},${s_t},${s_7})`
      //所有的存储过程调用语句都返回一个数组
      //此处的两个info数组只有一项[0]，其中两项f0,f1 分别是总数和过去七天

      
      const all_file = await prisma.file_info.findMany({
        where: { product_id: p_info.id, },
      })

      const x=[p_info,result_watch,result_star,all_file]//product_info已有冗余列，不需要返回u_info
      res.json(x)
    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.post(`/user=:u_log_id/product=:p_name`, async (req, res) => {//关注、点赞
    const { u_log_id ,p_name }=req.params
    const { watcher_id ,move_type}=req.body
      //try{

        const u_info = await prisma.user_info.findUnique({
          where: { user_log_id: u_log_id },
        })
    
        if(u_info==null)res.status(404)

        const p_info = await prisma.product_info.findUnique({
          where: { 
            NameAndId:{
              product_name: p_name,
              creator_id: u_log_id,
            }
          },
        })
    
        if(p_info==null)res.status(404)

      //move_type:
      //1:watch
      //2:unwatch
      //3:star
      //4:un_star
       if(move_type==1){
        await prisma.$queryRaw`call pr_to_watch(${watcher_id},${p_name})`
        alert('关注成功')
       }
       else if(move_type==2){
        await prisma.$queryRaw`call pr_to_unwatch(${watcher_id},${p_name})`
        alert('取消关注')
       }
       else if(move_type==3){
        await prisma.$queryRaw`call pr_to_star(${watcher_id},${p_name})`
        alert('收藏成功')
       }
       else if(move_type==4){
        await prisma.$queryRaw`call pr_to_unstar(${watcher_id},${p_name})`
        alert('取消成功')
       }
       else res.status(404)

    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  //仍未完成
  app.post(`/user=:u_log_id/product=:p_name/newFile`, async (req, res) => {//新建文件
    const { u_log_id ,p_name }=req.params
    const { c_id, f_name } = req.body
      //try{

        const u_info = await prisma.user_info.findUnique({
          where: { user_log_id: u_log_id },
        })
    
        if(u_info==null)res.status(404)

        const p_info = await prisma.product_info.findUnique({
          where: { 
            NameAndId:{
              product_name: p_name,
              creator_id: u_log_id,
            }
          },
        })
    
        if(p_info==null)res.status(404)

        

      const x=[p_info,result_watch,result_star,all_file]//product_info已有冗余列，不需要返回u_info
      res.json(x)
    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.get(`/user=:u_log_id/product=:p_name/code=:f_name`, async (req, res) => {//文件信息
    const { u_log_id, p_name, f_name } = req.params

    //try{
      const u_info = await prisma.user_info.findUnique({
        where: { user_log_id: u_log_id },
      })
  
      if(u_info==null)res.status(404)

      const p_info = await prisma.product_info.findUnique({
        where: { 
          NameAndId:{
            product_name: p_name,
            creator_id: u_log_id,
          }
        },
      })
  
      if(p_info==null)res.status(404)

      const f_info = await prisma.file_info.findUnique({
        where: { 
          PidAndFname: {
            product_id: p_info.id,
            file_name: f_name,
          }
        },
      })
      //res.json(f_info)
  
      if(f_info==null)res.status(404)

    var w_t,w_7,s_t,s_7

    const result_watch = await prisma.$queryRaw`call pr_watch_info(${p_info.id},${w_t},${w_7})`
    const result_star = await prisma.$queryRaw`call pr_star_info(${p_info.id},${s_t},${s_7})`
    //所有的存储过程调用语句都返回一个数组
    //此处的两个info数组只有一项[0]，其中两项f0,f1 分别是总数和过去七天
      
      const all_edition = await prisma.$queryRaw`call pr_view_all_edition(${f_info.id})`

      const x=[p_info,result_watch,result_star,all_edition]//product_info已有冗余列，不需要返回u_info
      res.json(x)
    //}catch(error){
      //res.status(404).send('something wrong')
    //}
  })

  app.get(`/searchProduct/type=:type_of_search&q=:query&p=:page`, async (req, res) => {
    const { query, type_of_search, page } = req.params

    var adjusted_page=parseInt(page)

    if(adjusted_page<=0)adjusted_page = 1;//处理所有负数据和0，定为第一页

    var n_//必须的传值手段，定义而不用

    var i,l,width=new Number;

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

    var max_page=Math.ceil(n/width);//最大页数
    //var max_page=Math.ceil(parseInt(n[0].f0)/width);//最大页数

    l=0;i=0;

    for(i=(adjusted_page-1)*width;i<=adjusted_page*width-1;i++){
      limited_result[l]=all_result[i];
      l++;
    }

    var t = n + "";
    var str = '{"total_num":'+t+'}';
    var total = JSON.parse(str);  //数字转化JSON格式

    const x=[total,limited_result]//应当判断limited_result[0]是否为空，空则显示没有更多信息

    res.json(x)
  })


app.get('/users', async (req, res) => {
    const users = await prisma.user_info.findMany()
    res.json(users)
})
const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)