## host
http://dev.accessible.avosapps.com


## 查询app列表

### path
/api/app

### method
GET

### request
- search 关键词，可选
- sid 当有关键词时查询下一页结果传入sid
- page 页数，可选，默认0
- pageSize 每页记录数，可选，默认20

### response
```json
{
  "success": true,
  "data": {
    "total": 2,
    "sid": "cXVlcnlUaGVuRmV0Y2g7Mzs3NTEyNTA6U011blJkcDhSZi1kZWRmbEF6dWh2UTsxNDU1MzY6TDhVV0M4UXBSTHl5ZTc5NWtQek1zdzs3NTEyNTE6U011blJkcDhSZi1kZWRmbEF6dWh2UTswOw==",
    "list": [
      {
        "name": "手机淘宝",
        "_highlight": null,
        "cateId": {
          "__type": "Pointer",
          "className": "category",
          "objectId": "563166d160b25b7991a019e8"
        },
        "des": "手机淘宝(Android版)是阿里巴巴专为Android手机用户推出的满足其生活消费和线上购物需求的软件，具有查看附近的生活优惠信息、商品搜索、浏览、购买、支付、收藏、物流查询、旺旺沟通等在线功能，成为了用户方便快捷的生活消费入口。Android 2.x 用户，请移步 http://m.taobao.com 下载手机淘宝。",
        "objectId": "5626416b00b0023ca69e7424",
        "createdAt": "2015-10-20T13:28:11.178Z",
        "updatedAt": "2015-10-29T00:29:56.671Z"
      }
    ]
  }
}
```

## 用户登录

### path
/api/user/login

### method
POST

### request
- username 用户名 required
- password  密码 required

### response
```json
{
    "success": true,
    "data": {
        "username": "308512341@qq.com",
        "emailVerified": false,
        "mobilePhoneNumber": "18658038037",
        "mobilePhoneVerified": true,
        "objectId": "5630d5a360b20b1458767bfd",
        "createdAt": "2015-10-28T14:03:15.361Z",
        "updatedAt": "2015-10-28T14:07:11.624Z",
        "token": {
            "value": "6594244d20def94e3ae1bf77f4f289078633387a6ff40213cbe386e25443071f982273e28a4c5fbe",
            "expired": 1448710419211  //token实效时间
        }
    }
}
```

## 用户注册

### path
/api/user/signup

### method
POST

### request
- username 用户名 required
- password  密码 required
- phone 手机号  required

### response
```json
{
    "success": true,
    "data": {
        "username": "308512341@qq.com",
        "emailVerified": false,
        "mobilePhoneNumber": "18658038037",
        "mobilePhoneVerified": true,
        "objectId": "5630d5a360b20b1458767bfd",
        "createdAt": "2015-10-28T14:03:15.361Z",
        "updatedAt": "2015-10-28T14:07:11.624Z",
        "token": {
            "value": "6594244d20def94e3ae1bf77f4f289078633387a6ff40213cbe386e25443071f982273e28a4c5fbe",
            "expired": 1448710419211  //token实效时间
        }
    }
}
```