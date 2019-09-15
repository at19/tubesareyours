const DataLoader = require("dataloader");

const Video = require("../../models/video");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const videoLoader = new DataLoader(videoIds => {
  return videos(videoIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

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

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return transformUser(user);
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

const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    createdVideos: () => videoLoader.loadMany(user._doc.createdVideos)
  };
};

exports.transformVideo = transformVideo;
exports.transformUser = transformUser;
