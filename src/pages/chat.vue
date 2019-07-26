<template>
    <div class="container">
      <div class="chatbox">
        <div class="chatleft">
          <div class="top">
            <span style="font-size: 22px"><i class="fa fa-user-circle" style="margin-right: 8px"></i>Welcome，{{this.message.sender}}</span>
          </div>
          <div class="center">
            <p style="padding-left: 10px;font-size: 21px;margin-top:5px;margin-bottom: 2px ">OnlineChatters:</p>
            <ul>
              <li v-for="(name,index) in online" @click="talk(index)" >
                <a>{{name}}
                <span class="notify">newMes</span>
              </a>
              </li>
            </ul>
          </div>
          <div class="out" @click="logout" style="padding-top: 5px;padding-left: 5px;">
            <div>
              <i class="fa fa-user" style="margin-right: 4px;margin-left:4px;padding-top:2px;color: white"></i>
              LogOut
            </div>
          </div>
        </div>
        <div class="chatright">
          <div class="top2">
            <span style="margin-left: 20px;">
                <i class="fa fa-envelope"  v-show="editable" style="margin-right: 4px;margin-left:4px;padding-top:2px;color: #989797"></i>
              {{this.message.receiver}}</span>
          </div>
          <div id="center2" v-show="editable">
            <ul>
              <li style="display: block" v-for="(info) in historyMes">
                {{info.sender}}
                <i class="fa fa-caret-right" style="margin-right: 4px;margin-left:4px;color: #00b0ff"></i>
                {{info.receiver}}{{info.time}}
                <p style="font-size: 16px;margin-top:2px;margin-bottom: 12px ">{{info.content}}</p>
              </li>
            </ul>
            <p style="text-align: center">以上为历史消息</p>
            <ul>
              <li style="display: block" v-for="(info) in newMes">
                {{info.sender}}
                <i class="fa fa-caret-right" style="margin-right: 4px;margin-left:4px;color: #00b0ff"></i>
                {{info.receiver}}{{info.time}}
                <p style="font-size: 16px;margin-top:2px;margin-bottom: 12px ">{{info.content}}</p>
              </li>
            </ul>
            <div id='bottom' style="color:#bcbcbc;font-size: 10px;">已经在最底端啦～</div>
          </div>
          <div class="footer" v-show="editable" >
            <textarea v-model="message.content" class="info" maxlength="500" rows="5" cols="40" style="width: 495px;" placeholder="请在此输入要发送的内容..."></textarea>
            <div style="text-align: right"><button class="sendbtn" @click="sendInfo">发送</button></div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
let moment = require('moment')
moment.locale('zh-cn')
export default {
  name: 'chat',
  sockets: {
    online: function (list) {
      this.online = list.split(',')
      let index = this.online.indexOf(sessionStorage.username)
      this.online.splice(index, 1)
      // alert('socket connected users:' + this.online.length)
    },
    receive: function (msg) {
      console.log('new message' + JSON.stringify(msg))
      this.messages.push(msg)
      if (msg.sender === this.message.receiver) {
        this.newMes.push(JSON.stringify(msg))
      }
      if (msg.sender !== sessionStorage.username) {
        let index = this.online.indexOf(msg.sender)
        document.getElementsByClassName('notify')[index].style.display = 'inline'
      } else {
        let index = this.online.indexOf(msg.receiver)
        document.getElementsByClassName('notify')[index].style.display = 'inline'
      }
    }
  },
  mounted () {
    if (sessionStorage.username === undefined) {
      this.$router.push('/')
    } else {
      this.init()
      this.getData()
    }
  },
  data () {
    return {
      lis: [],
      online: [],
      editable: false,
      hasExisted: true,
      message: {
        sender: sessionStorage.username,
        receiver: '',
        content: '',
        time: ''
      },
      messages: [], // 所有新消息
      newMes: [], // 当前对话用户的新消息
      historyMes: [], // 当前对话用户的历史消息
      databaseMes: [] // 所有此用户相关的历史消息
    }
  },
  methods: {
    init () {
      this.$socket.emit('chat', sessionStorage.username)
    },
    getData () {
      let self = this
      this.$axios.post('/api/getHistoryMes', {
        name: sessionStorage.username
      }).then(
        function (response) {
          console.log(response.data)
          self.databaseMes = response.data
          console.log(self.databaseMes.length)
        }
      ).catch(function (error) {
        console.log(error)
      })
    },
    talk (index) {
      // alert(index)
      document.getElementsByClassName('notify')[index].style.display = 'none'
      this.message.receiver = this.online[index]
      this.editable = true
      window.tt = this.online[index] // 当前对话用户
      this.newMes = this.messages.filter(function (item) {
        return ((item.receiver === window.tt) || (item.sender === window.tt))
      })
      this.historyMes = this.databaseMes.filter(function (item) {
        return ((item.receiver === window.tt) || (item.sender === window.tt))
      })
      console.log('newMes' + JSON.stringify(this.newMes))
      this.$nextTick(() => {
        this.scrollBtm()
      })
    },
    scrollBtm () {
      // alert
      console.log('height:' + document.getElementById('center2').scrollHeight)
      document.getElementById('bottom').scrollIntoView(false)
      // alert('end')
    },
    sendInfo () {
      let temp = {}
      this.message.time = moment().format().toString().substr(0, 19).replace('T', '-')
      // alert(this.message.time)
      temp.sender = this.message.sender
      temp.receiver = this.message.receiver
      temp.content = this.message.content
      temp.time = this.message.time
      console.log(temp.time)

      if (this.message.content.length > 255) {
        alert('输入信息过长，请分段发送（不超过255个字符）')
      } else if (this.message.content.length === 0) {
        alert('信息不能为空')
      } else {
        this.messages.push(temp)
        this.newMes.push(temp)
        this.$socket.emit('talking', JSON.stringify(this.message))
      }
      this.message.content = ''
      this.$nextTick(() => {
        this.scrollBtm()
      })
    },
    logout () {
      alert('logging out' + sessionStorage.username)
      this.$socket.emit('logout', sessionStorage.username)
      sessionStorage.removeItem('username')
      this.$router.push({name: 'welcome'})
    }
  }
}
</script>

<style scoped>
  .container{
    width: calc(100vw);
    height: calc(100vh);
    background-image: url("../assets/image.jpg") ;
    background-size: cover;
    background-repeat: no-repeat;
    font-size: 16px;
    color:#333;
    padding-top: 30px;
  }
  .chatbox {
    position: relative;
    width: 60%;
    margin: 10px 20%;
    overflow-y: auto;
    background-color: #fefefe;
    display: flex;
    height: 550px;
  }

  ul,li{
    padding:0;
    margin:0;
    list-style: none;
    color: #4b4b4b;
  }
  .center li{
    font-size: 19px;
    padding-left: 28px;
  }
  .center li:hover{
    background-color: #00b0ff;
    color:white;
    cursor: pointer;
  }

  .chatleft{
    flex: 1;
    padding-top: 10px;
    border: 1px solid #e6e6e6;
  }

  .top{
    height: 42px;
    border-bottom: 1px solid #e6e6e6;
    padding-left: 10px;
  }

  .center{
    /* background: blue; */
    height: calc(100% - 82px);
  }
  .out{
    background-color: #c0c0c0;
    height:40px;
  }

  .out:hover{
    cursor: pointer;
    background-color: #929292;
    color: white;
  }
  .notify{
    padding: 2px;
    font-size: 12px;
    display: none;
    color: rgb(181, 31, 31);
    border-radius: 10px;
    background-color: rgb(199, 199, 199);
  }

  .chatright{
    flex: 2;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .top2{
    height: 42px;
    background-color: #80808033;
    font-size: 24px;
  }

  #center2{
    padding: 10px;
    flex: 1;
    overflow: scroll;
  }

  p{
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
  .footer{
    border-top: 1px solid #cbcbcb;
    padding: 5px;
    height: 130px;
  }

  .sendbtn{
    text-decoration:none;
    font-size:16px;
    background-color: #5f8eaf;
    outline: none;
    color:white;
  }

  .sendbtn:hover{
    cursor: pointer;
    background-color: #5781af;
  }
  .info{
    outline: none;
    font-size: 16px;
  }
  .info:focus {
    outline: none;
    border: 1px solid #343434;

  }
</style>
