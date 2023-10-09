"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/thread";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onsubmit = async (values: z.infer<typeof CommentValidation>) => {
    const { thread } = values;
    console.log("submited")

    await addCommentToThread(
      threadId,
      thread,
      JSON.parse(currentUserId),
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  aria-placeholder="Comment...."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
              <FormControl />
            </FormItem>
          )}
        />
        <Button className="comment-form_btn" type="submit">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
