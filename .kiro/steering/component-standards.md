---  
inclusion: fileMatch  
fileMatchPattern: "frontend/src/components/**/*.tsx"  
---  
  
## React组件开发规范  
  
### 组件结构  
1. 导入顺序：React -> 第三方库 -> 内部组件 -> 类型定义  
2. 使用函数式组件 + Hook  
3. Props接口必须导出，命名为`{ComponentName}Props`  
  
### 样式规范  
- 使用Tailwind CSS类名  
- 复杂样式抽取为独立的样式组件  
- 颜色变量使用设计系统定义  
