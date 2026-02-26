const express = require("express");
const yts = require("yt-search");
const { spawn } = require("child_process");

const app = express();

// Serve frontend files
app.use(express.static(__dirname));

// Home route
app.get("/", (req, res) => {
    res.send("Music fetch server is running");
});

// Search route
app.get("/search", async (req, res) => {
    try {
        const result = await yts(req.query.q);

        const songs = result.videos.slice(0, 5).map(video => ({
            title: video.title,
            url: video.url,
            thumbnail: video.thumbnail,
            author: video.author.name,
            duration: video.timestamp
        }));

        res.json(songs);

    } catch (err) {
        console.log(err);
        res.send("Search error");
    }
});

// Stream route using yt-dlp
app.get("/stream", (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.send("No URL provided");
    }

    const ytDlp = spawn("./yt-dlp", [
        "-f", "bestaudio",
        "-o", "-",
        url
    ]);

    res.setHeader("Content-Type", "audio/mp4");

    ytDlp.stdout.pipe(res);

    ytDlp.stderr.on("data", (data) => {
        console.log(`yt-dlp error: ${data}`);
    });

    ytDlp.on("close", (code) => {
        console.log(`yt-dlp process exited with code ${code}`);
    });

});

// IMPORTANT: Render-compatible port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});