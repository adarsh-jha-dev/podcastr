import { v } from "convex/values";
import { action } from "./_generated/server";
import axios from "axios";

export const getImageAction = action({
  args: { text: v.string() },
  handler: async (_, { text }) => {
    const form = new FormData();
    form.append("prompt", text);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      form,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );
    return response.data;
  },
});
