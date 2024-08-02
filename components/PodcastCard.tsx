import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const PodcastCard = ({
  id,
  title,
  description,
  imgURL,
}: {
  id: Id<"podcasts">;
  title: string;
  description?: string;
  imgURL: string;
}) => {
  const increaseViews = useMutation(api.podcasts.updatePodcastViews);
  const router = useRouter();
  const handleViews = async () => {
    // increase views
    await increaseViews({ podcastId: id });

    router.push(`/podcast/${id}`, {
      scroll: true,
    });
  };
  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image
          src={imgURL}
          width={174}
          height={174}
          alt={title}
          className="rounded-xl 2xl:size-[200px] aspect-square h-fit w-full"
        />
        <div className="flex flex-col">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal capitalize text-white-4">
            {description}{" "}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
