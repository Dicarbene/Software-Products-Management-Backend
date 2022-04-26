const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

 app.post(`/login`, async (req, res) => {
    const { id, email, password } = req.body

    var e_id=0//是否存在id，0为不存在
    var e_email=0//是否存在email，0为不存在
    var _if=0;//是否创建成功，1为成功

    const result = await prisma.$queryRaw`call pr_log_in(${id},${password},${email},${e_id},${e_email},${_if})`

    console.log(result);
    res.json(result)
  })

  app.post(`/logon`, async (req, res) => {
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

  app.get(`/user/:user_id`, async (req, res) => {//用户信息
    const { user_id } = req.params

    try{
      const info = await prisma.user_info.findUnique({
      where: { id: parseInt(user_id) },
    })

    const watched = await prisma.$queryRaw`call pr_recent_watch(${user_id})`
    const stared = await prisma.$queryRaw`call pr_recent_star(${user_id})`

    const x=[info,watched,stared]

    res.json(info)
    }catch(error){
      res.send('something wrong')
    }
  })

  app.get(`/user/:u_id/product/:p_id`, async (req, res) => {
    const { u_id ,p_id }=req.params
//abandoned method
    //const { p_name, u_id } = req.body//u_id为浏览者id_to_log，并非创建者
    /*try {
      const p = await prisma.product_info.findUnique({
        where: { id: p_id, },
      })
      //const result = await prisma.$queryRaw`call pr_to_watch(${p_name},${u_id},${_if})`

      res.json(p)
    } catch (error) {
      res.json({ error: `wrong find param` })*/
//abandoned method

      var w_t,w_7,s_t,s_7

      const result_watch = await prisma.$queryRaw`call pr_watch_info(${p_id},${w_t},${w_7})`
      const result_star = await prisma.$queryRaw`call pr_star_info(${p_id},${s_t},${s_7})`

      const p = await prisma.product_info.findUnique({
        where: { id: parseInt(p_id), },
      })
      const u = await prisma.user_info.findUnique({
        where: { id: parseInt(u_id), },
      })
      const all_file = await prisma.file_info.findMany({
        where: { product_id: parseInt(p_id), },
      })

      const x=[p,u,result_watch,result_star,all_file]
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