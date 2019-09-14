const Video = require("../../models/video");
const User = require("../../models/user");

const { transformVideo } = require("./merge");

module.exports = {
  videos: async ({ first, offset = 0 }) => {
    try {
      const videoData = await Video.find();
      const videos =
        first === undefined
          ? videoData.slice(offset)
          : videoData.slice(offset, offset + first);
      return videos.map(video => transformVideo(video));
    } catch (err) {
      throw err;
    }
  },
  createVideo: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const video = new Video({
      url: args.videoInput.url,
      date: new Date(),
      creator: req.userId
    });
    let createdVideo;
    try {
      const result = await video.save();
      createdVideo = transformVideo(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdVideos.push(video);
      await creator.save();

      return createdVideo;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
