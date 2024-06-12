const StreamChat = require("stream-chat").StreamChat;

const stream = async (req, res) => {
  try {
    const client = StreamChat.getInstance(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );
    const streamToken = client.createToken(req.user.userId.toString());
    res.status(200).json({ streamToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { stream };
