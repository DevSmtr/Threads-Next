import { fetchUser } from "@/lib/actions/user.actionst";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getActivity } from "@/lib/actions/user.actionst";

const Page = async () => {
  //clerk auth
  const user = await currentUser();
  if (!user) return null;

  //user database
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //getActivity
  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="flex flex-col mt-10 gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((element) => (
              <Link key={element._id} href={`/thread/${element.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={element.author.image}
                    alt="profile picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {element.author.name}
                    </span> {" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3"> No activity yet ):</p>
        )}
      </section>
    </section>
  );
};

export default Page;
