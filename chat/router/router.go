package router

import (
	"LinChat/middlewear"
	"LinChat/service"

	"github.com/gin-gonic/gin"
)

func Router() *gin.Engine {
	//初始化路由
	router := gin.Default()

	//v1版本
	v1 := router.Group("v1")

	//用户模块，后续有个用户的api就放置其中
	user := v1.Group("user")
	{
		user.POST("/list", middlewear.JWY(), service.List)
		user.POST("/login_pw", service.LoginByNameAndPassWord)
		user.POST("/new", service.NewUser)
		user.DELETE("/delete", middlewear.JWY(), service.DeleteUser)
		user.POST("/updata", middlewear.JWY(), service.UpdataUser)
		user.GET("/SendUserMsg", service.SendUserMsg)
	}
	// 关系
	relation := v1.Group("relation").Use(middlewear.JWY())
	{
		relation.GET("/list", service.FriendList)
		relation.POST("/add", service.AddFriendByName)
		relation.POST("/new_group", service.NewGroup)
		relation.GET("/group_list", service.GroupList)
		relation.POST("/join_group", service.JoinGroup)
	}
	//图片、语音模块
	upload := v1.Group("upload").Use(middlewear.JWY())
	{
		upload.POST("/image", service.Image)
	}
	//聊天记录
	v1.POST("/user/redisMsg", service.RedisMsg).Use(middlewear.JWY())
	return router
}
