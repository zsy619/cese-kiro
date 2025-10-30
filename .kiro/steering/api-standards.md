---  
inclusion: fileMatch  
fileMatchPattern: "backend/api/**/*"  
---  
  
## API开发规范  
  
### 响应格式  
  
所有API必须返回统一格式：  
{  
   "code": 200,  
   "message": "操作成功",  
   "data": {},  
   "timestamp": 1635724800
}

  
### 错误处理  

- 400: 参数错误
- 401: 未授权
- 500: 服务器错误
