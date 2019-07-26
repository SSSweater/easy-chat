<template>
  <div class="App2">
    <header class="App-header2">
      <div v-show="hasExisted" id="infoBox">
        <h1>{{data}}</h1>
        <h2>Sign In</h2>
        <div>
          <div ref="login_form" :model="login_form">
              <input v-model="login_form.name" id="username"  placeholder="昵称">
              <hr class="hr1"/>
              <input v-model="login_form.pw" type="password" id="password" placeholder="密码">
              <hr class="hr1"/>
              <button v-on:click="login" id="login">登录</button>
              <button v-on:click="register" id="signUp">注册</button>

          </div>
        </div>
        <div>
          <p class="forget">Forget Password? Click here！</p>
        </div>
      </div>

      <div v-show="!hasExisted" id="infoBox2">
        <h1>{{data}}</h1>
        <h2>Sign Up</h2>
        <div>
          <div ref="register_form" :model="register_form">
            <div>
              <input v-model="register_form.name" id="username2"  placeholder="请输入新昵称">
              <hr class="hr1"/>
            </div>
            <div>
              <input v-model="register_form.pw" type="password" id="password2" placeholder="请输入密码">
              <hr class="hr1"/>
              <button v-on:click="confirm" id="confirm">确定</button>
              <button v-on:click="cancel" id="cancel">返回</button>

            </div>
          </div>
        </div>
        <div>
          <p class="forget">Forget Password? Click here！</p>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
let crypto = require('crypto')
export default {
  name: 'welcome',
  data () {
    return {
      data: '',
      hasExisted: true,
      login_form: {
        name: '',
        pw: ''
      },
      register_form: {
        name: '',
        pw: ''
      }
    }
  },
  mounted () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      if (sessionStorage.username !== undefined) {
        alert('您将登出，请重新登陆！')
        this.$socket.emit('logout', sessionStorage.username)
        sessionStorage.removeItem('username')
      }
    },
    login () {
      let name = this.login_form.name
      let pw = this.login_form.pw
      let self = this
      var md5 = crypto.createHash('md5')
      md5.update(pw)// 要加密的密码
      pw = md5.digest('hex')// 加密完的密码
      console.log('login')
      this.$axios.post('/api/login', {
        name: name,
        pw: pw
      }).then(
        function (response) {
          console.log(response.data)
          if (response.data === 'wrong') {
            alert('用户名或者密码错误！')
          } else if (response.data === 'hasLogin') {
            alert('该用户已登陆！')
            // eslint-disable-next-line eqeqeq
          } else if (response.data == 'yes') {
            sessionStorage.username = name
            self.$router.push({name: 'chat'})
          }
        }
      ).catch(function (error) {
        console.log(error)
      })
    },

    register () {
      this.hasExisted = false
    },

    cancel () {
      this.hasExisted = true
    },

    confirm () {
      let name = this.register_form.name
      let pw = this.register_form.pw
      let self = this
      console.log('registering' + name.length + pw.length)
      if (name === '' || pw === '') {
        alert('信息不能为空')
      } else if (name.length > 8 || pw.length > 32) {
        alert('信息不能过长（昵称不超过8位）')
      } else {
        var md5 = crypto.createHash('md5')
        md5.update(pw)// 要加密的密码
        pw = md5.digest('hex')// 加密完的密码
        this.$axios.post('/api/register', {
          name: name,
          pw: pw
        }).then(
          function (response) {
            console.log(response.data)
            if (response.data === 'hasRegistered') {
              self.$alert('用户已经存在！', '', {
                confirmButtonText: '确定'
              })
            } else if (response.data === 'yes') {
              alert('注册成功！')
              sessionStorage.username = name
              self.$router.push({name: 'chat'})
            }
          }
        ).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>
  *{
    padding:0;
    margin:0;
  }

  #infoBox,#infoBox2{
    margin-top:9%;
    margin-bottom: 12%;
    width: 25%;
    height: 400px;
    padding-left: 20px;
    float: left;

  }

  .forget{
    margin-top: 20px;
    margin-left:20px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
  }

  input[type="submit"]{
    border: none;
    margin-left: 20px;
    margin-top: 30px;
    margin-bottom:0px;
    background-color:#4ea248;
    border: none;
    outline:none;
    color: white;
    width:100px;
    height:40px;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
  }

  .hr1
  {
    border:none;
    border-bottom: 1px solid #b5b5b5;
    margin-bottom: 20px;
    margin-top: 5px;
    margin-right:15px;
  }

  #username,#username2{
    border-style:none none none none;
    outline:none;
    color: white;
    padding-left: 4px;
    font-size:20px;
    height: 40px;
    width: 90%;
    background-color: #282c34;
  }

  #password,#password2{

    color: white;
    border-style:none none none none;
    outline:none;
    padding-left: 4px;
    font-size:20px;
    height: 40px;
    width: 90%;
    background-color: #282c34;
  }

  #signUp,#cancel{
    border: none;
    margin-left: 30px;
    margin-top: 30px;
    margin-bottom:0px;
    background-color: #45b7de;
    border: none;
    outline:none;
    color: white;
    width:100px;
    height:40px;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
  }

  #login,#confirm{
    border: none;
    margin-left: 15px;
    margin-top: 30px;
    margin-bottom:0px;
    background-color: #4ea248;
    border: none;
    outline:none;
    color: white;
    width:100px;
    height:40px;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
  }

  a{
    text-decoration:none;
    color: white;
  }

  .App2 {
    text-align: center;
  }

  .App-header2 {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }

  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
