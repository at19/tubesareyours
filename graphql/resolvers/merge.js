const Video = require("../../models/video");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const videos = async videoIds => {
  try {
    const videos = await Video.find({ _id: { $in: videoIds } });
    return videos.map(video => {
      return transformVideo(video);
    });
  } catch (err) {
    throw err;
  }
};

const singleVideo = async videoId => {
  try {
    const video = await Video.findById(videoId);
    return transformVideo(video);
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdVideos: videos.bind(this, user._doc.createdVideos)
    };
  } catch (err) {
    throw err;
  }
};

const transformVideo = video => {
  return {
    ...video._doc,
    _id: video.id,
    date: dateToString(video._doc.date),
    creator: user.bind(this, video.creator)
  };
};

exports.transformVideo = transformVideo;
