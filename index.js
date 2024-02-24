require('dotenv').config();

const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const { handleValidateKey } = require("./handleValidateKey")

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use(handleValidateKey);

app.get("/", (request, response) => {
  response.status(200).json({status: "alive"});
});

app.post("/download", async (request, response) => {
  try {
    const videoURL = `https://youtu.be/${request.body.videoId}`;
    response.setHeader("Access-Control-Allow-Origin", "*");
    
    const info = await ytdl.getInfo(videoURL)
    const title = info.videoDetails.title;
    response.setHeader('Access-Control-Expose-Headers', 'Content-disposition')
    response.setHeader('Content-disposition', `attachment; filename="${title}.mp4"`);
    ytdl(videoURL, {
      filter: (format) => {
        return format.container === "mp4" &&
          format.hasAudio && format.hasVideo;
      }, quality: "highest"
    })
      .pipe(response)
      .on("finish", () => {
        response.status(200);
      })
      .on("error", () => {
        response.status(500);
      });
  } catch (error) {
    console.log(error);
    response.status(500).json({error});
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


