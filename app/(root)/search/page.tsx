import UserCard from "@/components/cards/UserCard";
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

  //exec search
  const {isNext,users} = await fetchUsers({
    userId:user.id,
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
        users.length === 0 ? (
        <p className="no-result">No users</p>
        ) : (
          <>
          {
          users.map(person => (
          <UserCard
          key={person.id}
          id={person.id}
          name={person.name}
          username={person.username}
          imageUrl={person.image}
          personType='User'
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
