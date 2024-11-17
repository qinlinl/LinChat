package service

import (
	"fmt"
	"io"
	"math/rand"
	"os"
	"strings"
	"time"

	"LinChat/common"

	"github.com/gin-gonic/gin"
)

// Image 图片语音上传并返回url
func Image(ctx *gin.Context) {
	w := ctx.Writer
	req := ctx.Request

	// 获取文件
	srcFile, head, err := req.FormFile("file")
	if err != nil {
		common.RespFail(w, err.Error())
		return
	}

	// 检查文件类型
	fileType := head.Header.Get("Content-Type")
	validImageTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/gif":  true,
	}

	if !validImageTypes[fileType] {
		common.RespFail(w, "上传的文件不是有效的图片格式！")
		return
	}

	// 检查文件后缀
	suffix := ".png"
	ofilName := head.Filename
	tem := strings.Split(ofilName, ".")
	if len(tem) > 1 {
		suffix = "." + tem[len(tem)-1]
	}

	// 保存文件
	fileName := fmt.Sprintf("%d%04d%s", time.Now().Unix(), rand.Int31(), suffix)
	dstFile, err := os.Create("./dist/upload/" + fileName)
	if err != nil {
		common.RespFail(w, err.Error())
		return
	}
	defer dstFile.Close() // 确保文件在函数退出时关闭

	_, err = io.Copy(dstFile, srcFile)
	if err != nil {
		common.RespFail(w, err.Error())
		return
	}

	url := "/upload/" + fileName
	common.RespOK(w, url, "发送成功")
}
