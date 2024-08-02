// Long endpoint: /synthesisTasks
// - Up to 500,000 characters
// - Asynchronous, takes ~1s per 800 chars
// - Returns a TaskId (use to check status)

import axios from "axios";
import { action } from "./_generated/server";
import { v } from "convex/values";

const headers = {
  Authorization: `Bearer ${process.env.UNREALSPEECH_BEARER_TOKEN}`,
};

export const generateAudioAction = action({
  args: { voiceId: v.string(), text: v.string() },
  handler: async (_, { voiceId, text }) => {
    const data = {
      Text: text,
      VoiceId: voiceId,
      Bitrate: "192k",
      Speed: "0",
      Pitch: "1",
      TimestampType: "sentence", // word or sentence
      //'CallbackUrl': '<URL>', // pinged when ready
    };

    const response = await axios.post(
      "https://api.v7.unrealspeech.com/synthesisTasks",
      data,
      {
        headers,
      }
    );

    return response.data;
  },
});
