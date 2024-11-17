package main

import (
	"fmt"

	"LinChat/global"
	"LinChat/initialize"
	"LinChat/router"
)

func main() {
	//初始化日志
	initialize.InitLogger()
	//初始化配置
	initialize.InitConfig()
	//初始化数据库
	initialize.InitDB()
	initialize.InitRedis()

	router := router.Router()

	router.Run(fmt.Sprintf(":%d", global.ServiceConfig.Port))
}
