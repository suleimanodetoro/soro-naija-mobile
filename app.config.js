// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
    // Add other environment variables here
  },
});
