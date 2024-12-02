import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

const splitVideos = (timestamps, videoPath) => {
  const currentTime = new Date().getTime();
  const outputDir = `output/${currentTime}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const promises = timestamps.map((timestamp, index) => {
    return new Promise((resolve, reject) => {
      const outputFilePath = path.join(outputDir, `segment-${index + 1}.mp4`);

      const [startHours, startMinutes, startSeconds] = timestamp.timestamp_start
        .split(":")
        .map(parseFloat);
      const [endHours, endMinutes, endSeconds] = timestamp.timestamp_end
        .split(":")
        .map(parseFloat);

      const startTotalSeconds =
        startHours * 3600 + startMinutes * 60 + startSeconds;
      const endTotalSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;

      const durationSeconds = endTotalSeconds - startTotalSeconds;

      const durationHours = Math.floor(durationSeconds / 3600)
        .toString()
        .padStart(2, "0");
      const durationMinutes = Math.floor((durationSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const durationSecs = (durationSeconds % 60).toFixed(2).padStart(5, "0");

      const duration = `${durationHours}:${durationMinutes}:${durationSecs}`;

      ffmpeg(videoPath)
        .setStartTime(timestamp.timestamp_start)
        .setDuration(duration)
        .output(outputFilePath)
        .on("end", () => resolve(outputFilePath))
        .on("error", reject)
        .run();
    });
  });

  return Promise.all(promises);
};

export default async (req, res) => {
  if (req.method === "POST") {
    const videoFiles = req.body;

    try {
      res.status(200).json({
        test: "sample",
        sample: "test",
      });
    } catch (error) {
      console.error("Error processing videos:", error);
      res.status(500).json({ error: "Error processing videos" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
