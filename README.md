# discord-mudog

### Invite MUDOG 
click [Link](https://discord.com/api/oauth2/authorize?client_id=746198610961498194&permissions=8&scope=bot) invite MUDOG to your discord server.

### Command
```!help - show command list.```  
```!play - play youtube music. Example: !play { "video keyword" or "video url" }.```  
```!skip - skip music.```

### Wishing fountain
if you have any idea, welcome to let me know.

concrete operations :

1.
<img width="1432" alt="截圖 2022-01-05 下午2 51 19" src="https://user-images.githubusercontent.com/13149494/148174722-986ef96f-d73a-4973-b7d3-612eed392d82.png">

2.
<img width="1431" alt="截圖 2022-01-05 下午2 55 35" src="https://user-images.githubusercontent.com/13149494/148174756-f4a04426-5406-418b-811d-2b43b5986223.png">

### Report bug
you can follow Wishing fountain's step and change label from "enhancement" to "bug"

### Using
Clone
```
git clone https://github.com/mrmosssir/discord-mudog.git
```
Install
```
npm install
```
Environment
```
touch .env
// add varible into .env
// BOTTOKEN={ your discord bot token }
// YTTOKEN={ your youtube API token }
// YTBASEURL=https://www.googleapis.com/youtube/v3/search
```
Run
```
npm start
```
Notice
```
1. node version >= v16.6.
2. remove engine config in package.json if you running at local.
3. heroku environment need use "heroku config:set { env varible }, .env file is use for local."
```
