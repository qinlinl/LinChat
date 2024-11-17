import axios from '@/axios'
import qs from 'qs'
export function login(username: string, password: string) {
  const data = qs.stringify({
    username,
    password,
  })
  return axios.post('/v1/user/login_pw ', data)
}
export function register(
  email: string,
  username: string,
  password: string,
  Identity: string,
) {
  const data = qs.stringify({
    email,
    username,
    password,
    Identity,
  })
  return axios.post('/v1/user/new', data)
}
interface updata {
  email: string
  username: string
  password: string
  Identity: string
  avatar: string
}
export function updata(userInfo: updata) {
  const data = qs.stringify(userInfo)
  return axios.post('/v1/user/updata  ', data)
}
export function addFriend(targetName: string) {
  const data = qs.stringify({
    targetName,
  })
  return axios.post('/v1/relation/add', data)
}
export function addGroup(comId: string) {
  const data = qs.stringify({
    comId,
  })
  return axios.post('/v1/relation/join_group', data)
}
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/v1/upload/image', formData)
}
interface groupinfo {
  cate: number
  icon: string
  name: string
  desc: string
}
export function createGroup(userInfo: groupinfo) {
  const data = qs.stringify(userInfo)
  return axios.post('/v1/relation/new_group  ', data)
}
export function feiendsList() {
  return axios.get('/v1/relation/list')
}
export function groupsList() {
  return axios.get('/v1/relation/group_list')
}
interface readmsg {
  userIdA: string
  userIdB: string
  Type: string
  start: string
  end: string
  isRev: boolean
}
export function readmsg(msg: readmsg) {
  const data = qs.stringify(msg)
  return axios.post('/v1/user/redisMsg', data)
}
