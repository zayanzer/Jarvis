/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/


const {
    System,
    IronMan,
    postJson,
    isPrivate,
    interactWithAi,
    makeUrl,
    gemini
} = require("../lib/");
const config = require("../config.js");

async function readMore() {
  const readmore = String.fromCharCode(8206).repeat(4001);
  return readmore;
};

System({
    pattern: "thinkany", 
    fromMe: isPrivate,
    desc: "ai thinkany", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*need query !!*_\n_*eg: .thinkany who is iron man*_");
    const { result } = await interactWithAi("thinkany", match);
    await m.send(result, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363197401188542@newsletter', newsletterName: 'ᴛʜɪɴᴋᴀɴʏ ᴀɪ' }}});
});

System({
    pattern: "aoyo", 
    fromMe: isPrivate,
    desc: "ai aoyo", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*need query !!*_\n_*eg: .aoyo who is iron man*_");
    const { result } = await interactWithAi("aoyo", match);
    await m.send(result, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363197401188542@newsletter', newsletterName: 'ᴀᴏʏᴏ ᴀɪ' }}});
});

System({
    pattern: "prodia", 
    fromMe: isPrivate,
    desc: "prodia image gen ai", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*need query !!*_\n_*eg: .prodia a girl in full moon*_");
    await m.reply("*please wait generating*");
    const img = await interactWithAi("prodia", match);
    await m.sendFromUrl(img, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363197401188542@newsletter', newsletterName: 'ᴩʀᴏᴅɪᴀ ᴀɪ' }}});
});


System({
    pattern: "dalle", 
    fromMe: isPrivate,
    desc: "dalle image gen ai", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*need query !!*_\n_*eg: .dalle a girl in full moon*_");
    await m.reply("*please wait generating*");
    const img = await interactWithAi("dalle", match);
    await m.sendFromUrl(img, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363197401188542@newsletter', newsletterName: 'ᴅᴀʟʟᴇ ᴀɪ' }}});
});


System({
    pattern: "lepton", 
    fromMe: isPrivate,
    desc: "ai lepton", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*need query !!*_\n_*eg: .lepton who is iron man*_");
    const { result } = await interactWithAi("lepton", match);
    await m.send(result.replace(/\[[^\]]*\]|\([^)]*\)|<[^>]*>/g, ''), { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363197401188542@newsletter', newsletterName: 'ʟᴇᴩᴛᴏɴ ᴀɪ' }}});
});

System({
    pattern: "gpt", 
    fromMe: isPrivate,
    desc: "ai chatgpt", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*need query !!*_\n_*eg: .chatgpt who is iron man*_");
    const { response } = await interactWithAi("gpt", match);
    await m.send(response, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363197401188542@newsletter', newsletterName: 'ᴄʜᴀᴛɢᴩᴛ 4' }}});
});

System({
    pattern: "bb", 
    fromMe: isPrivate,
    desc: "blackbox ai", 
    type: "ai",
}, async (message, match, m) => {
       match = match || m.reply_message.text;
       if(match && m.quoted) match = match + m.reply_message.text;
       if(!match) return m.reply("_*need query !!*_\n_*eg: .bb who is iron man*_");
       const { result } = await interactWithAi("blackbox", match);
       await m.send(result, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363197401188542@newsletter', newsletterName: 'ʙʟᴀᴄᴋ ʙᴏx' }}});
});

System({
    pattern: "chatgpt", 
    fromMe: isPrivate,
    desc: "ai chatgpt", 
    type: "ai",
}, async (message, match, m) => {
    match = match || m.reply_message.text;
    if(match && m.quoted) match = match + m.reply_message.text;
    if(!match) return m.reply("_*need query !!*_\n_*eg: .chatgpt who is iron man*_");
    const response = await interactWithAi("chatgpt", match);
    await m.send(response, { contextInfo: { forwardingScore: 1, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363197401188542@newsletter', newsletterName: 'ᴄʜᴀᴛɢᴩᴛ' }}});
});

System({
    pattern: 'upscale ?(.*)',
    fromMe: isPrivate,
    desc: 'Enhance images with AI',
    type: 'ai',
}, async (message, match) => {
    if (!message.quoted || !message.reply_message.image) return await message.send("Reply to an image baka!");
    const img = await message.reply_message.downloadAndSave();
    const upscale = await interactWithAi("upscale", img);
    await message.send(upscale, { caption: "_*upscaled 🍉*_" }, "img");
});

System({
	pattern: 'ocr ?(.*)',
	fromMe: isPrivate,
	desc: 'Text Recognition from image',
	type: 'ai',
}, async (message, match) => {
    if(!message.reply_message.image) return await message.reply("_Reply to a image_");
    const data = await makeUrl(await message.reply_message.downloadAndSaveMedia());
    const res = await fetch(IronMan(`ironman/ai/ocr?url=${data}`));
    if (res.status !== 200) return await message.reply('*Error*');
    const text = await res.json()
    if (!text.text) return await message.reply('*Not found*');
    await message.reply(`\`\`\`${text.text}\`\`\``);
});

System({
  pattern: 'detectai ?(.*)',
  fromMe: isPrivate,
  desc: 'Detects AI-generated text',
  type: 'ai',
}, async (message, match, m) => {
  const text = message.reply_message.text || match;
  const res = await fetch(IronMan(`ironman/ai/detectai?text=${encodeURIComponent(text)}`));
  const data = await res.json();
  let output = "*𝙰𝙸 𝙳𝙴𝚃𝙴𝙲𝚃𝙸𝙾𝙽*\n\n";
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    output += `*тєχт:* ${item.text}\n`;
    output += `*ѕ¢σяє:* ${(item.score * 100).toFixed(2)}%\n`;
    output += `*туρє:* ${item.type}\n\n`;
    if (i === 2 && data.length > 3) {
      output += await readMore();
    }
  }
  await message.reply(output.trim());
});



System({
   pattern: 'gemini ?(.*)',
   fromMe: isPrivate,
   desc: 'Chat with gemini ai',
   type: 'ai',
}, async (message, match, m) => {

  if (match && message.reply_message?.image) {
      try {
         const path = await message.reply_message.downloadAndSaveMedia();
         const res = await gemini(match, path);
	      if (!res) {
            return m.reply("*Sorry, I couldn't get a response from Gemini AI.*");
         }
             await m.send(res, {
               contextInfo: {
               forwardingScore: 1,
               isForwarded: true,
               forwardedNewsletterMessageInfo: {
               newsletterJid: '120363197401188542@newsletter',
               newsletterName: 'ɢᴇᴍɪɴɪ ᴀɪ'
               }
            }
         });
      } catch (error) {
         console.error("Error processing image:", error);
         m.reply("*Failed to process the image. Please try again.*");
      }
   } else if (match) {
      const res = await gemini(match);
         if (!res) {
         return m.reply("*Sorry, I couldn't get a response from Gemini AI.*");
      }
           await m.send(res, {
            contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
            newsletterJid: '120363197401188542@newsletter',
            newsletterName: 'ɢᴇᴍɪɴɪ ᴀɪ'
            }
         }
      });
   } else {
      m.reply("_*Need Prompt !!*_\n_*eg: .gemini who is iron man?*_\n _For image you have to Reply to an image and also give a prompt_");
   }
});

