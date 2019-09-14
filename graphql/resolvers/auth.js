const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const { transformUser } = require("./merge");

module.exports = {
  users: async ({ first, offset = 0 }) => {
    try {
      const userData = await User.find();

      const users =
        first === undefined
          ? userData.slice(offset)
          : userData.slice(offset, offset + first);

      return users.map(user => transformUser(user));
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    const { name, email, password } = args.userInput;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        name,
        email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "!!!$$SUPER_DUPER_SECRET_KEY$$!!!",
      {
        expiresIn: "1h"
      }
    );
    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    };
  }
};
