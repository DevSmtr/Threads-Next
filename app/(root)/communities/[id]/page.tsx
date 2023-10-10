import CommunityCard from "@/components/cards/CommunityCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser,fetchUsers } from "@/lib/actions/user.actionst";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const Page = async () => {
  //clerk auth
  const user = await currentUser();
  if (!user) return null;

  //user database
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //fetch communities
  const{communities}= await fetchCommunities({
    searchString:'',
    pageNumber:1,
    pageSize:25
  })

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      {/* Searhc bar */}

      <div className="mt-14 flex flex-col gap-9">
        {
        communities.length === 0 ? (
        <p className="no-result">No users</p>
        ) : (
          <>
          {
          communities.map(community => (
          <CommunityCard
          key={community.id}
          id={community.id}
          name={community.name}
          username={community.username}
          imgUrl={community.image}
          bio={community.bio}
          members={community.members}
          /> 
          ))  
          }
          </>
        ) 
        }
      </div>
    </section>
  );
};

export default Page;
