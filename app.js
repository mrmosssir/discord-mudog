const { searchByKeyword, searchByUrl } = require('./modules/youtube_process.js');
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
client.player = player;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ activities: [{ name: '-help' }], status: 'online' });
});

client.on('messageCreate', async (message) => {
  try {
    const args = message.content.trim().toLowerCase().split(/ +/g);
    const command = args.shift();
    let guildQueue = client.player.getQueue(message.guild.id);
    switch(command) {
      case '-play':
        if (!message.member.voice.channel) {
          message.react('💩');
          return;
        }
        const queue = client.player.createQueue(message.guild.id);
        const params = args.join(' ');
        const video = params.indexOf('youtube.com') < 0
          ? await searchByKeyword(params)
          : await searchByUrl(params);

        await queue.join(message.member.voice.channel);
        await queue.play(video.url).catch(_ => {
          if(!guildQueue) queue.stop();
        });
        message.channel.send({ embeds: [
          new MessageEmbed()
            .setColor('#0099ff')
            .setURL(video.url)
            .setTitle(video.title)
            .setDescription('已新增到播放清單')
        ]});
        break;
      case '-skip':
        if (guildQueue) {
          message.react('👌');
          guildQueue.skip();
        } else {
          message.channel.send({ embeds: [
            new MessageEmbed()
              .setColor('#ff9900')
              .setDescription('沒有東西在播啊 三小')
          ]});
        }
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
    message.channel.send({ embeds: [
      new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('未知的錯誤 - 這什麼 這到底是什麼爛東西 歐齁齁齁')
    ]});
  }
});

client.login(process.env.BOTTOKEN);