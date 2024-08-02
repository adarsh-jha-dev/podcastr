"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "./Header";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import EmblaCarousel from "./Carousel";
import { useRouter } from "next/navigation";
import LoaderSpinner from "./LoaderSpinner";
import { useAudio } from "@/_providers/AudioProvider";
import { cn } from "@/lib/utils";

const RightSidebar = () => {
  const router = useRouter();
  const { user } = useUser();
  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount);
  const { audio } = useAudio();
  if (!topPodcasters) return <LoaderSpinner />;

  return (
    <section
      className={cn("right_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <SignedIn>
        <Link className="flex gap-3 pb-12" href={`/profile/${user?.id}`}>
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} {user?.lastName}
            </h1>
            <Image
              src={`/icons/right-arrow.svg`}
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>
      <section>
        <Header headerTitle="Fans like you" />
        <EmblaCarousel fansLikeDetail={topPodcasters!} />
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Podcastrs" />
        <div className="flex flex-col gap-6">
          {topPodcasters?.slice(0, 4).map((podcastr) => (
            <div
              key={podcastr._id}
              className="flex cursor-pointer justify-between "
              onClick={() => {
                router.push(`/profile/${podcastr.clerkId}`);
              }}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={podcastr.imgUrl}
                  width={44}
                  height={44}
                  alt={podcastr.name}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 text-white-1 font-semibold">
                  {podcastr.name}
                </h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 text-white-1 font-normal">
                  {podcastr.totalPodcasts} Podcast
                  {podcastr.totalPodcasts > 1 && "s"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default RightSidebar;
