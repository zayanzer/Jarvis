/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/


const { System, IronMan, isPrivate, getJson, Google, isUrl } = require("../lib/");


System({
    pattern: 'google ?(.*)',
    fromMe: isPrivate,
    desc: 'Searches Google',
    type: 'search',
}, async (message, match) => {
    if (!match) return await message.reply("*Need a query to search*\n_Example: who is iron man_");
    const data = await Google(match);
    let response = '';
    data.forEach((result, i) => {
        response += `\n`;
        response += `*TITLE:* ${result.title}\n`;
        response += `*LINK:* ${result.link}\n`;
        response += `*DESCRIPTION:* ${result.description}\n`;
    });
    await message.send(response, { quoted: message.data });
});

System({
        pattern: "gs ?(.*)",
        fromMe: isPrivate,
        desc: "Google search (short)",
        type: "search"
}, async (message, match) => {
        if (!match) return await message.send("*Need a query to search*\n_Example: who is iron man_");
        const response = await Google(match);
        const text = `*⬢ Title*: ${response[0].title}\n\n*⬢ Description*: _${response[0].description}_\n\n*⬢ Link*: ${response[0].link}`
        await message.reply(text);
});

System({
        pattern: "scs (.*)",
        fromMe: isPrivate,
        desc: "SoundCloud search",
        type: "search"
}, async (message, match) => {
        if (!match) return await message.reply("*Need a query to search*\n_Example: .scs life waster_");
        const fullResult = match.trim().startsWith("-full");
        const query = fullResult ? match.replace("-full", "").trim() : match.trim();
        const { result: results } = await getJson(IronMan(`ironman/s/soundcloud?query=${query}`));
        if (!results || results.length === 0) return await message.send("No results found.");
        if (fullResult) {
            let fullit = "";
            results.forEach(result => {
                fullit += `*Title*: ${result.title}\n*URL*: ${result.url}\n*Artist*: ${result.artist}\n*Views*: ${result.views}\n*Release*: ${result.release}\n*Duration*: ${result.duration}\n\n`;
            });
            await message.send(fullit);
        } else {
            const furina = results[0];
            const { title, artist, views, release, duration, thumb, url } = furina;
            let caption = `╔═════◇\n\n*➭Title*: ${title}\n*➭Artist*: ${artist}\n*➭Views*: ${views}\n*➭Release*: ${release}\n*➭Duration*: ${duration}\n*➭URL*: ${url}\n\n*Use -full in front of query to get full results*\n_Example: .scs -full ${match}_\n\n╚══════════════════╝`;
            if (thumb) {
                await message.send({ url: thumb }, { caption: caption }, "image");
            } else {
                await message.send(caption);
            }
        }
});

System({
    pattern: "device ?(.*)",
    fromMe: isPrivate,
    desc: "Get details of a Device",
    type: "search"
}, async (message, match) => {
    if (!match) return await message.reply("*Need a device name*\n_Example: device Xiaomi 11 i_");
    var data = await getJson(IronMan(`ironman/device?query=${match}`));
    if (Array.isArray(data) && data.length > 0) {
        const { id, name, img, description } = data[0];
        const cap = `*➭Name:* ${name}\n*➭Id:* ${id}\n*➭Description:* ${description}`;
        await message.reply({ url: img }, { caption: cap }, "image");
    } else {
        await message.reply("*Device not Found*");
    }
});

System({
    pattern: 'wallpaper ?(.*)',
    fromMe: isPrivate,
    desc: 'wallpaper search',
    type: 'search'
}, async (message, match) => {
    if (!match) return await message.reply("*Need a wallpaper name*\n_Example: .wallpaper furina_");
    const images = await getJson(IronMan(`ironman/wallpaper/wlhven?name=${encodeURIComponent(match)}`));
    const urls = images.filter(item => item.url).map(item => item.url);
    if (urls.length > 0) {
        const selectedUrls = urls.sort(() => 0.5 - Math.random()).slice(0, 5);
        for (const imageUrl of selectedUrls) {
            await message.send({ url: imageUrl }, {}, "image");
        }
    } else {
        await message.reply("No wallpapers found for the given query.");
    }
});

System({
  pattern: 'img ?(.*)',
  fromMe: isPrivate,
  desc: 'Search google images',
  type: 'search',
}, async (message, match) => {
  const [query, count] = match.split(',').map(item => item.trim());
  const imageCount = count ? parseInt(count, 10) : 5;
  if (!query) return await message.reply("*Need a Query*\n_Example: .img ironman, 5_");
  const msg = await message.send(`Downloading ${imageCount} images of *${query}*`);
  const urls = await getJson(IronMan(`ironman/s/google?image=${encodeURIComponent(query)}`));
  if (urls.length === 0) return await message.send("No images found for the query");
  const list = urls.length <= imageCount ? urls : urls.sort(() => 0.5 - Math.random()).slice(0, imageCount);
  for (const url of list) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await message.sendFromUrl(url)
  }
  await msg.edit("*Downloaded*");
});

System({
    pattern: "dict", 
    fromMe: isPrivate,
    desc: "to search in dictionary", 
    type: "search",
}, async (msg, text) => {
    if (!text) return await msg.reply('*Please enter any word!*');
    await getJson('https://api.dictionaryapi.dev/api/v2/entries/en/' + text)
     .then(async (data) => {
      let word = data[0].word;
      let phonetics = data[0].phonetics[0].text;
      let partsOfSpeech = data[0].meanings[0].partOfSpeech;
      let definition = data[0].meanings[0].definitions[0].definition;
      let example = (data[0].meanings[0].definitions.find(obj => 'example' in obj) || {})['example'];
      return await msg.reply(`_Word_ : *${word}*\n_Parts of speech_ : *${partsOfSpeech}*\n_Definition_ :\n*${definition}*${example == undefined ? `` : `\n_Example_ : *${example}*`}`.trim() );
    }).catch(async (e) => {
      return await msg.reply('*Unable to find definition for ' + text + '!*');
    });
});

System({
  pattern: 'sps ?(.*)',
  fromMe: isPrivate,
  desc: 'Search for songs on Spotify',
  type: 'search',
}, async (message, match) => {
  if (!match) return await message.reply("*Give a Spotify query to search*\n_Example: .sps yoasobi idol_");
  const query = match.startsWith('-full') ? match.slice(5).trim() : match;
  const result = await getJson(IronMan(`ironman/spotify/s?query=${query}`));
  if (match.startsWith('-full')) {
    const cap = result.map(item => `━━━━━━━━━━━━━━━━━━━━⬤\n*∘ᴛɪᴛʟᴇ:* ${item.title}\n*∘ᴀʀᴛɪꜱᴛ:* ${item.artist}\n*∘ᴅᴜʀᴀᴛɪᴏɴ:* ${item.duration}\n*∘ᴘᴏᴘᴜʟᴀʀɪᴛʏ:* ${item.popularity}\n*∘ᴜʀʟ:* ${item.url}\n*∘ᴘʀᴇᴠɪᴇᴡ:* ${item.preview}\n`).join("\n");
    await message.send(cap);
  } else {
    await message.send({ url: result[0].thumbnail }, {
      caption: `*ᴛɪᴛʟᴇ:* ${result[0].title}\n*ᴀʀᴛɪꜱᴛ:* ${result[0].artist}\n*ᴅᴜʀᴀᴛɪᴏɴ:* ${result[0].duration}\n*ᴜʀʟ:* ${result[0].url}\n\n*Use -full for all results*\n_Example: .sps -full ${match}_`
    }, "image");
  }
});

System({
  pattern: 'playstore ?(.*)',
  fromMe: isPrivate,
  desc: 'Searches for an app on Play Store',
  alias: ['ps'],
  type: 'search',
}, async (message, match) => {
  if (!match) return await message.reply("*Nᴇᴇᴅ ᴀɴ ᴀᴘᴘ ɴᴀᴍᴇ*\n*Example.ps WhatsApp*");
  const query = match.startsWith('-full') ? match.slice(5).trim() : match;
  const result = await getJson(IronMan(`ironman/search/playstore?app=${query}`));
  if (match.startsWith('-full')) {
    const cap = result.map(item => `┈──────────────────────⏣\n*ɴᴀᴍᴇ:* ${item.name}\n*ᴅᴇᴠᴇʟᴏᴘᴇʀ:* ${item.developer}\n*ʀᴀᴛᴇ:* ${item.rate2}\n*ʟɪɴᴋ:* ${item.link}\n`).join("\n");
    await message.send(cap);
  } else {
    await message.send({ url: result[0].img }, {
      caption: `*◦ɴᴀᴍᴇ:* ${result[0].name}\n*◦ᴅᴇᴠᴇʟᴏᴘᴇʀ:* ${result[0].developer}\n*◦ʀᴀᴛᴇ:* ${result[0].rate2}\n*◦ʟɪɴᴋ:* ${result[0].link}\n\n*Use -full for all results*\n_Example: .ps -full ${match}_`
    }, "image");
}});

System({
    pattern: 'lyrics (.*)',
    fromMe: isPrivate,
    type: 'search',
    desc: 'Search for song lyrics',
}, async (message, match) => {
    if(!match) return await message.reply("*Need a song name!*\n_Example: .lyrics let me die_");
    var res = await fetch(IronMan(`ironman/song/lrc?track_name=${encodeURIComponent(match)}`));
    if (!res.ok) return await message.send("Error fetching lyrics.");
    const { title, artist, lyrics, image } = await res.json();
    const caption = `*Title:* ${title}\n*Artist:* ${artist}\n\n${lyrics}`;
    await message.send({ url: image }, { caption, quoted: message }, "image");
});

System({
    pattern: 'xsearch ?(.*)',
    fromMe: isPrivate,
    nsfw: true,
    type: "search",
    desc: "Xnxx searcher"
}, async (message, match) => {
    if (!match || isUrl(match)) return await message.reply('_Please provide a valid query_');
    const data = await getJson(api + `search/xnxx?q=${encodeURIComponent(match)}`);
    await message.send(data.result.map(item => `*💎 Title:* ${item.title}\n*🔗 Link:* ${item.link}\n\n`).join(""));
});

System({
    pattern: 'duckgo',
    fromMe: isPrivate,
    type: "search",
    desc: "goduck searcher"
}, async (message, match) => {
    if (!match) return await message.reply("*Need a query to search*\n_Example: who is iron man_");
    const { result } = await getJson(api + "search/duckgo?q=" + match);
    if(!result.status) return await message.reply("*Can't find try again with more info*");
    await message.reply({ url: result.image }, { caption: `*⬢ Query :* ${match}\n\n*⬢ Description :* ${result.data}\n\n*⬢ Link :* ${result.url}` }, 'image');
});
