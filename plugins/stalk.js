/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/


const { System, IronMan, isPrivate, getJson } = require("../lib/");


System({
    pattern: 'ig ?(.*)',
    fromMe: isPrivate,
    desc: 'Instagram profile details',
    type: 'stalk',
}, async (message, match) => {
    if (!match) return await message.reply("*Need a username*\n_Example: .ig sedboy.am_");
    var data = await getJson(IronMan(`ironman/igstalk?id=${encodeURIComponent(match.trim())}`));
    var caption = '';
    if (data.name) caption += `*𖢈ɴᴀᴍᴇ:* ${data.name}\n`;
    if (data.username) caption += `*𖢈ᴜꜱᴇʀɴᴀᴍᴇ:* ${data.username}\n`;
    if (data.bio) caption += `*𖢈ʙɪᴏ:* ${data.bio}\n`;
    if (data.pronouns && data.pronouns.length > 0) caption += `*𖢈ᴘʀᴏɴᴏᴜɴꜱ:* ${data.pronouns.join(', ')}\n`;
    if (data.followers) caption += `*𖢈ꜰᴏʟʟᴏᴡᴇʀꜱ:* ${data.followers}\n`;
    if (data.following) caption += `*𖢈ꜰᴏʟʟᴏᴡɪɴɢ:* ${data.following}\n`;
    if (data.category) caption += `*𖢈ᴄᴀᴛᴇɢᴏʀʏ:* ${data.category}\n`;
    if (typeof data.private !== 'undefined') caption += `*𖢈ᴘʀɪᴠᴀᴛᴇ ᴀᴄᴄ:* ${data.private}\n`;
    if (typeof data.business !== 'undefined') caption += `*𖢈ʙᴜꜱꜱɪɴᴇꜱ ᴀᴄᴄ:* ${data.business}\n`;
    if (data.email) caption += `*𖢈ᴇᴍᴀɪʟ:* ${data.email}\n`;
    if (data.url) caption += `*𖢈ᴜʀʟ:* ${data.url}\n`;
    if (data.contact) caption += `*𖢈ɴᴜᴍʙᴇʀ:* ${data.contact}\n`;
    if (data.action_button) caption += `*𖢈ᴀᴄᴛɪᴏɴ ʙᴜᴛᴛᴏɴ:* ${data.action_button}\n`;
    await message.send({ url: data.hdpfp }, { caption: caption.trim(), quoted: message }, "image");
});

System({
    pattern: 'gitinfo ?(.*)',
    fromMe: isPrivate,
    desc: 'github user details',
    type: 'stalk',
}, async (message, match) => {
    if (!match) return await message.reply("*_Need Github UserName_*");   
    const data = await getJson(`https://api.github.com/users/${match}`);
    const GhUserPP = data.avatar_url || "https://graph.org/file/924bcf22ea2aab5208489.jpg";
    const userInfo = `\n⎔ *Username* : ${data.login} \n⎔ *Name* : ${data.name || "Not Available"} \n⎔ *Bio* : ${data.bio || "Not Available"} \n\n➭ *ID* : ${data.id}\n➭ *Followers* : ${data.followers}\n➭ *Following* : ${data.following}\n➭ *Type* : ${data.type}\n➭ *Company* : ${data.company || "Not Available"}\n➭ *Public Repos* : ${data.public_repos}\n➭ *Public Gists* : ${data.public_gists}\n➭ *Email* : ${data.email || "Not Available"}\n➭ *Twitter* : ${data.twitter_username || "Not Available"}\n➭ *Location* : ${data.location || "Not Available"}\n➭ *Blog* : ${data.blog || "Not Available"}\n➭ *Profile URL* : ${data.html_url}\n➭ *Created At* : ${data.created_at}\n\n`;
    await message.send({ url: GhUserPP }, { caption: userInfo }, "image");
});

System({
  pattern: 'tkt ?(.*)',
  fromMe: isPrivate,
  desc: 'TikTok Stalk',
  type: 'stalk',
}, async (message, match) => {
  if (!match) return await message.reply("*Need a TikTok username*");
  const response = await fetch(IronMan(`ironman/stalk/tiktok?id=${encodeURIComponent(match)}`));
  const data = await response.json();
  const { user, stats } = data;
  const caption = `*⭑⭑⭑⭑ᴛɪᴋᴛᴏᴋ ꜱᴛᴀʟᴋ ʀᴇꜱᴜʟᴛ⭑⭑⭑⭑*\n\n`
    + `*➥ᴜꜱᴇʀɴᴀᴍᴇ:* ${user.uniqueId}\n`
    + `*➥ɴɪᴄᴋɴᴀᴍᴇ:* ${user.nickname}\n`
    + `*➥ʙɪᴏ:* ${user.signature}\n`
    + `*➥ᴠᴇʀɪꜰɪᴇᴅ:* ${user.verified}\n`
    + `*➥ꜰᴏʟʟᴏᴡᴇʀꜱ:* ${stats.followerCount}\n`
    + `*➥ꜰᴏʟʟᴏᴡɪɴɢ:* ${stats.followingCount}\n`
    + `*➥ʜᴇᴀʀᴛꜱ:* ${stats.heartCount}\n`
    + `*➥ᴠɪᴅᴇᴏꜱ:* ${stats.videoCount}`;
  await message.send({ url: user.avatarLarger }, { caption }, "image");
});

System({
    pattern: 'telegram ?(.*)',
    fromMe: isPrivate,
    desc: 'telegram profile details',
    type: 'stalk',
}, async (message, match) => {
    if (!match) return await message.reply("*Need a username*\n_Example: .telegram @TGMovies2Bot_");
    const { result } = await getJson(api + "stalk/telegram?query=" + match)
    return message.reply({ url: result.profile }, { caption: `*User name :* ${result.userName}\n*Nick name :* ${result.nickName}\n*About :* ${result.about}\n*Via telegram :* ${result.telegram}`}, "image")
});
