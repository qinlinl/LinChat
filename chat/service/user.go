package service

import (
	"LinChat/common"
	"LinChat/dao"
	"LinChat/middlewear"
	"LinChat/models"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

func List(ctx *gin.Context) {
	list, err := dao.GetUserList()
	if err != nil {
		ctx.JSON(200, gin.H{
			"code":    -1, //0 表示成功， -1 表示失败
			"message": "获取用户列表失败",
		})
		return
	}
	ctx.JSON(http.StatusOK, list)
}
func LoginByNameAndPassWord(ctx *gin.Context) {
	name := ctx.PostForm("username")
	password := ctx.PostForm("password")
	data, err := dao.FindUserByName(name)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"code":    -1, //0 表示成功， -1 表示失败
			"message": "登录失败",
		})
		return
	}

	if data.Name == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"code":    -1,
			"message": "用户名不存在",
		})
		return
	}

	//由于数据库密码保存是使用md5密文的， 所以验证密码时，是将密码再次加密，然后进行对比，后期会讲解md:common.CheckPassWord
	ok := common.CheckPassWord(password, data.Salt, data.PassWord)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"code":    -1,
			"message": "密码错误",
		})
		return
	}

	Rsp, err := dao.FindUserByNameAndPwd(name, data.PassWord)
	if err != nil {
		zap.S().Info("登录失败", err)
	}

	//这里使用jwt做权限认证
	token, err := middlewear.GenerateToken(Rsp.ID, "yk")
	if err != nil {
		zap.S().Info("生成token失败", err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code":     0,
		"message":  "登录成功",
		"tokens":   token,
		"userId":   Rsp.ID,
		"username": Rsp.Name,
		"email":    Rsp.Email,
		"avatar":   Rsp.Avatar,
	})
}
func NewUser(ctx *gin.Context) {
	user := models.UserBasic{}
	user.Email = ctx.Request.FormValue("email")
	user.Name = ctx.Request.FormValue("username")
	password := ctx.Request.FormValue("password")
	repassword := ctx.Request.FormValue("Identity")
	fmt.Println(password)
	if user.Name == "" || password == "" || repassword == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "用户名或密码不能为空！",
			"data":    user,
		})
		return
	}

	//查询用户是否存在
	_, err := dao.FindUser(user.Name)
	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{
			"code":    -1,
			"message": "该用户已注册",
			"data":    user,
		})
		return
	}

	if password != repassword {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "两次密码不一致！",
			"data":    user,
		})
		return
	}

	//生成盐值
	salt := fmt.Sprintf("%d", rand.Int31())

	//加密密码
	user.PassWord = common.SaltPassWord(password, salt)
	user.Salt = salt
	t := time.Now()
	user.LoginTime = &t
	user.LoginOutTime = &t
	user.HeartBeatTime = &t
	dao.CreateUser(user)
	ctx.JSON(http.StatusOK, gin.H{
		"code":    0, //  0成功   -1失败
		"message": "新增用户成功！",
		"data":    user,
	})
}
func UpdataUser(ctx *gin.Context) {
	user := models.UserBasic{}

	id, err := strconv.Atoi(ctx.GetHeader("userId"))
	if err != nil {
		zap.S().Info("类型转换失败", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "注销账号失败",
		})
		return
	}
	user.ID = uint(id)
	Name := ctx.Request.FormValue("username")
	PassWord := ctx.Request.FormValue("password")
	repassword := ctx.Request.FormValue("Identity")
	Email := ctx.Request.FormValue("email")
	Phone := ctx.Request.FormValue("phone")
	avatar := ctx.Request.FormValue("avatar")
	gender := ctx.Request.FormValue("gender")
	_, err_usernname := dao.FindUser(Name)
	if err_usernname != nil {
		ctx.JSON(http.StatusConflict, gin.H{
			"code":    -1,
			"message": "该用户已注册",
		})
		return
	}
	if Name != "" {
		user.Name = Name
	}
	if PassWord != repassword {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "两次密码不一致！",
		})
		return
	}
	if PassWord != "" {
		salt := fmt.Sprintf("%d", rand.Int31())
		user.Salt = salt
		user.PassWord = common.SaltPassWord(PassWord, salt)
	}
	if Email != "" {
		user.Email = Email
	}
	if Phone != "" {
		user.Phone = Phone
	}
	if avatar != "" {
		user.Avatar = avatar
	}
	fmt.Println("----------------------", avatar)
	if gender != "" {
		user.Gender = gender
	}

	_, err = govalidator.ValidateStruct(user)
	if err != nil {
		zap.S().Info("参数不匹配", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "参数不匹配",
		})
		return
	}

	_, err = dao.UpdateUser(user)
	if err != nil {
		zap.S().Info("更新用户失败", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "修改信息失败",
		})
		return
	}
	token, err := middlewear.GenerateToken(uint(id), "yk")
	if err != nil {
		zap.S().Info("生成token失败", err)
		return
	}
	data, err := dao.FindUserID(user.ID)
	if err != nil {
		zap.S().Info("查询失败", err)
	}
	ctx.JSON(http.StatusOK, gin.H{
		"code":     0,
		"message":  "修改成功",
		"tokens":   token,
		"userId":   data.ID,
		"username": data.Name,
		"email":    data.Email,
		"avatar":   data.Avatar,
	})
}
func DeleteUser(ctx *gin.Context) {
	user := models.UserBasic{}
	id, err := strconv.Atoi(ctx.Request.FormValue("id"))
	if err != nil {
		zap.S().Info("类型转换失败", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "注销账号失败",
		})
		return
	}

	user.ID = uint(id)
	err = dao.DeleteUser(user)
	if err != nil {
		zap.S().Info("注销用户失败", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "注销账号失败",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code":    0, //  0成功   -1失败
		"message": "注销账号成功",
	})
}

// 防止跨域站点伪造请求,
// 升级程序指定用于将 HTTP 连接升级到 WebSocket 连接的参数。
// 同时调用升级程序的方法是安全的
var upGrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

//socket使用流程：
//1.通过http连接转换为websocket连接
//2.获取websocket的消息
//3.处理消息后，向websocket写入相应信息
//4.释放连接

func SendMsg(ctx *gin.Context) {
	//升级为socket
	ws, err := upGrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	//释放连接
	defer func(ws *websocket.Conn) {
		err = ws.Close()
		if err != nil {
			fmt.Println(err)
		}
	}(ws)
	MsgHandler(ctx, ws)
}

// MsgHandler 向socket连接发送消息
func MsgHandler(ctx *gin.Context, ws *websocket.Conn) {
	for {

		_, data, err := ws.ReadMessage()
		if err != nil {
			fmt.Println(" MsgHandler 发送失败", err)
			continue
		}

		fmt.Println("接收数据：", string(data))

		err = common.Publish(ctx, common.PublishKey, string(data))
		if err != nil {
			fmt.Println("publish失败", err)
		}

		//从redis拿消息
		msg, err := common.Subscribe(ctx, common.PublishKey)
		if err != nil {
			fmt.Println(" MsgHandler 发送失败", err)
			return
		}

		tm := time.Now().Format("2006-01-02 15:04:05")
		m := fmt.Sprintf("[ws][%s]:%s", tm, msg)
		//向连接写入消息
		err = ws.WriteMessage(1, []byte(m))
		if err != nil {
			log.Fatalln("写入消息失败", err)

		}
	}
}

// SendUserMsg 发送消息
func SendUserMsg(ctx *gin.Context) {
	models.Chat(ctx.Writer, ctx.Request)
}

func ExitUser(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Query("id"))
	if err != nil {
		zap.S().Info("类型转换失败", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    -1, //  0成功   -1失败
			"message": "注销账号失败",
		})
		return
	}

	_, err = middlewear.GenerateToken(uint(id), "exit")
	if err != nil {
		zap.S().Info("")
	}
}
