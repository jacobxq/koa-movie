const {controller, get, post, auth, admin, Required } = require('../lib/decorator')
const {
  checkPassword
} = require('../service/admin')
const {
  getAllMovies
} = require('../service/movie')

@controller('admin')
export class adminController {
  @get('/movie/list')
  @auth
  @admin('admin')
  async getMovieList (ctx, next) {
    const movies = await getAllMovies()

    ctx.body = {
      success: true,
      data: movies
    }
  }

  @post('/login')
  @Required({
    body: ['email', 'password']
  })
  async adminLogin (ctx, next) {
    const { email, password } = ctx.request.body
    const data = await checkPassword(email, password)
    const { user, match } = data

    if (match) {
      ctx.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role,
        username: user.username
      }

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
