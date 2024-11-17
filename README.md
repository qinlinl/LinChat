# **LinChat**

LinChat 是一个基于现代前后端技术栈开发的实时聊天应用。

---

## **技术栈**

### 前端：
- **Vue 3**：现代化的前端框架，提供响应式 UI。
- **Element Plus**：基于 Vue 3 的 UI 组件库，提升开发效率。
- **Axios**：用于处理 HTTP 请求。

### 后端：
- **Go**：高性能后端开发语言。
- **Gin**：轻量级 Web 框架，支持高并发。
- **Gorm**：强大的 Go ORM 框架。

### 数据库：
- **MySQL**：关系型数据库，用于存储用户和消息数据。
- **Redis**：高效的缓存数据库，用于存储会话状态和加速查询。

---

## **页面展示**

### **登录页**

用户可以通过用户名和密码登录 LinChat。

![登录页](https://github.com/user-attachments/assets/0d1233a6-5fb8-44e6-881d-56b63be9620d)

---

### **主页面**

主页面展示聊天列表、好友信息，以及实时消息交流窗口。

![主页面](https://github.com/user-attachments/assets/1f74de7f-35f9-40b2-bcc9-d21035c11e15)

---

### **更新用户信息**

支持用户更新个人资料，如用户名、头像等。

![更新用户信息](https://github.com/user-attachments/assets/4299b545-9974-4263-9301-0711a1287477)

---

## **快速开始**

### 1. **前端**

进入前端目录并安装依赖：
```bash
cd vue_src
npm install
npm run dev
 ### 2. **后端**
进入后端目录，构建并运行服务：
cd chat
go mod tidy
go run main.go

功能特性
实时聊天：通过 WebSocket 实现消息的即时发送与接收。
用户管理：支持用户注册、登录以及更新个人信息。
好友系统：可以添加好友并管理好友列表。
LinChat/
├── vue_src/           # 前端代码（Vue 3 + Element Plus）
├── chat/            # 后端代码（Go + Gin + Gorm）
├── sql/           # 数据库初始化文件
├── LinChat/           # 编译好的后端运行文件
├── config.yaml           # 连接数据库的配置文件
├── README.md           # 项目说明文件

聊天记录：存储用户之间的聊天记录，并支持历史记录查询。

联系方式：2826141840@qq.com
欢迎提交问题和建议！如果您喜欢这个项目，请点个 ⭐️。
