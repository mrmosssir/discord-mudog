const axios = require('axios');
const { Client, Intents, MessageEmbed } = require('discord.js');
const { Player } = require("discord-music-player");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});
const player = new Player(client, { leaveOnEmpty: false });

const settings = {
  token: process.env.BOTTOKEN
};

client.player = player;

async function searchYoutube(key) {
  const base = process.env.YTBASEURL;
  const apiKey = process.env.YTAPIKEY;
  const url = encodeURI(`${base}/?key=${apiKey}&part=snippet&maxResult=1&q=${key}`)
  const res = await axios.get(url);
  const list = res.data.items[0];
  return {
    title: list.snippet.title,
    url: `https://www.youtube.com/watch?v=${list.id.videoId}`,
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ activities: [{ name: '-help' }], status: 'online' });
});

client.on('messageCreate', async (message) => {
  try {
    const args = message.content.trim().split(/ +/g);
    const command = args.shift();
    let guildQueue = client.player.getQueue(message.guild.id);
    switch(command) {
      case '-play':
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let target = args.join(' ');
        let result = {};
        if (target.indexOf('youtube.com') < 0) {
          result = await searchYoutube(target);
          target = result.url;
        }
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setURL(result.url ? result.url : target)
          .setTitle(result.title ? result.title : target)
          .setDescription('已新增到播放清單')
        let song = await queue.play(target).catch(_ => {
          if(!guildQueue) queue.stop();
        });
        message.channel.send({ embeds: [embed] });
        break;
      case '-skip':
        if (guildQueue) guildQueue.skip();
        message.channel.send({ embeds: [
          new MessageEmbed()
            .setColor(guildQueue ? '#0099ff' : '#ff9900')
            .setDescription(guildQueue ? '嫌我吵是嗎 ?' : '沒有東西在播啊 三小')
        ]});
        break;
      case '-dog':
        message.channel.send('不能亂叫不然會被刪掉 QQ');
        break;
      case '-help':
        message.channel.send({ embeds: [
          new MessageEmbed()
            .setColor('#62df88')
            .setTitle('指令列表')
            .setURL('https://github.com/mrmosssir/discord-mudog')
            .setDescription('我是 MUDOG 這裡告訴你怎麼操作我 ( 上面有連結 )')
            .setAuthor({ name: 'SUDOG', iconURL: 'https://i.imgur.com/RpvrOI2.jpg' })
            .addFields(
              { name: '-play', value: '播放 youtube 影音（ 可佇列 ）. 例 : !play ${ 關鍵字 or youtube 網址 }', inline: false },
              { name: '-skip', value: '跳過當前播放的影音', inline: false },
            )
        ]});
    }
  } catch (error) {
    console.log(error);
    const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription('未知的錯誤 - 這什麼 這到底是什麼爛東西 歐齁齁齁');
    message.channel.send({ embeds: [embed] });
  }
});

client.login(settings.token);