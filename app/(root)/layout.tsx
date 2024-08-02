import LeftSidebar from "@/components/LeftSidebar";
import MobileNav from "@/components/MobileNav";
import PodcastPlayer from "@/components/PodcastPlayer";
import RightSidebar from "@/components/RightSidebar";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex relative flex-col">
      <main className="relative flex bg-black-3">
        <LeftSidebar />
        <section className=" flex-1 min-h-screen flex-col p-4 sm:p-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px:4">
            <div className="flex h-16 items-center justify-between md:hidden">
              <Image
                src={"/icons/logo.svg"}
                alt="menu-icon"
                width={20}
                height={20}
              />
              <MobileNav />
            </div>
            <div>
              <Toaster />
              {children}
            </div>
          </div>
        </section>
        <RightSidebar />
      </main>
      <PodcastPlayer />
    </div>
  );
}
