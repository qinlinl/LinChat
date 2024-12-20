package models

import (
	"gorm.io/gorm"

	"time"
)

type Model struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type UserBasic struct {
	Model
	Name          string
	PassWord      string
	Avatar        string
	Gender        string `gorm:"column:gender;default:male;type:varchar(6) comment 'male表示男， famale表示女'"` //gorm为数据库字段约束
	Phone         string `valid:"matches(^1[3-9]{1}\\d{9}$)"`                                             //valid为条件约束
	Email         string `valid:"email"`
	Identity      string
	ClientIp      string `valid:"ipv4"`
	ClientPort    string
	Salt          string     //盐值
	LoginTime     *time.Time `gorm:"column:login_time"`
	HeartBeatTime *time.Time `gorm:"column:heart_beat_time"`
	LoginOutTime  *time.Time `gorm:"column:login_out_time"`
	IsLoginOut    bool
	DeviceInfo    string //登录设备
}

type Relation struct {
	Model
	OwnerId  uint   //谁的关系信息
	TargetID uint   //对方id 或者是群id
	Type     int    //关系类型： 1表示好友关系 2表示群关系
	Desc     string //描述
}

// UserTableName 指定表的名称
func (table *UserBasic) UserTableName() string {
	return "user_basic"
}

// func (r *Relation) RelTableName() string {
// 	return "relation"
// }
