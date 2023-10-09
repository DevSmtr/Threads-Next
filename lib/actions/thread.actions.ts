"use server";

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export const fetchThreadById = async (id: string) => {
  try {
    connectToDB();
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread: ${error.message}`);
  }
};

export const fetchPosts = async (pageNumber = 1, pageSize = 20) => {
  connectToDB();

  //calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  const query = { parentId: { $in: [null, undefined] } };

  //fetch the posts that have no parents
  const posts = await Thread.find(query)
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Thread.countDocuments(query);

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
};

export const createThread = async (thread: Params) => {
  const { text, author, communityId, path } = thread;

  try {
    connectToDB();

    //create thread
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    //push thread to user
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(`failed to create thread: ${error.message}`);
  }
};

export const addCommentToThread = async (
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) => {
  try {
    connectToDB();

    //find the original thread
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) throw new Error("original thread not founded");

    //create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    //save the comment
    const savedCommentThread = await commentThread.save();

    //update the original thread to include the new comment
    originalThread.children.push(savedCommentThread._id);

    //save the original thread
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`);
  }
};
