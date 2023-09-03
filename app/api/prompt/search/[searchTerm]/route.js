import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const creators = await User.find({
      $or: [
        { username: { $regex: params.searchTerm, $options: "i" } },
        { email: { $regex: params.searchTerm, $options: "i" } },
      ]
    })

    const creatorIds = creators.map(creator => creator._id);

    const prompts = await Prompt.find({
      $or: [
        { creator: { $in: creatorIds } },
        { prompt: { $regex: params.searchTerm, $options: "i" } },
        { tag: { $regex: params.searchTerm, $options: "i" } },
      ],
    }).populate("creator");
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts", { status: 500 });
  }
};
