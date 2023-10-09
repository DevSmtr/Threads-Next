import { fetchUser } from "@/lib/actions/user.actionst";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import PostThread from "@/components/forms/PostThread";

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const userId = JSON.parse(JSON.stringify(userInfo._id));

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userId} />
    </>
  );
};

export default Page;
