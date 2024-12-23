const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp'); 
const fs = require('fs');

const audioCut = (infile, start, end, filename = "cutted") => new Promise((resolve, reject) => {
  ffmpeg(infile)
   .setStartTime(start)
   .setDuration(end)
   .save(filename + ".mp3")
   .on("error", (e => reject(new Error(e.message))))
   .on("end", (() => {
      const file = fs.readFileSync(filename + ".mp3");
      resolve(file);
    }));
});

async function trim(buff, startTrim, endTrim) {
    try {
        const tempFile = "../temp.mp4";
        const outputFile = "trimmed_video.mp4";
        await fs.promises.writeFile(tempFile, buff);
        await new Promise((resolve, reject) => {
            ffmpeg(tempFile)
                .setStartTime(startTrim)
                .setDuration(parseFloat(endTrim) - parseFloat(startTrim))
                .output(outputFile)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });
        const file = await fs.promises.readFile(outputFile);
        await fs.promises.unlink(tempFile);
        await fs.promises.unlink(outputFile);
        return file;
    } catch (error) {
        return false;;
    }
};


async function createRoundSticker(mediaBuffer) {
  const roundedSticker = await sharp(mediaBuffer)
    .resize(512, 512) 
    .composite([
      {
        input: Buffer.from(
          '<svg><circle cx="256" cy="256" r="256" fill="white" /></svg>' 
        ),
        blend: 'dest-in' 
      }
    ])
    .webp({ quality: 75 }) 
    .toBuffer();

  return roundedSticker;
};



module.exports = { 
  trim, 
  audioCut,
  createRoundSticker
};
