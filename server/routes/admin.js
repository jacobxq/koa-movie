const {controller, get, post } = require('../lib/decorator')
const {
  checkPassword
} = require('../service/admin')

@controller('admin')
export class userController {
  @post('/login')
  async adminLogin (ctx, next) {
    const { email, password } = ctx.request.body
    const data = await checkPassword(email, password)
    const { user, match } = data

    if (match) {
      // ctx.session.user = {
      //   _id: user._id,
      //   email: user.email,
      //   role: user.role,
      //   username: user.username
      // }

      return (ctx.body = {
        success: true,
        data: {
          email: user.email,
          username: user.username
        }
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码错误'
    })
  }
}
