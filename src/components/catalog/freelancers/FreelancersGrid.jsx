import { ItemGroup } from "@/components/ui";
import { FreelancerItem } from "./FreelancerItem";

// Grille des freelances pour section homepage
export function FreelancersGrid({ freelancers = [] }) {
  return (
    <ItemGroup className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
      {freelancers.map((freelancer) => (
        <FreelancerItem key={freelancer.id} freelancer={freelancer} />
      ))}
    </ItemGroup>
  );
}
