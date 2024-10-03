import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Header />
      <div
        className="flex flex-col  items-center h-screen"
        style={{ fontFamily: "AvantGrade" }}
      >
        <h1 className="xl:text-6xl  text-4xl font-bold text-center">
          Made for people.{"  "}
          <br className="md:hidden block" />
          <span className="text-[#611f69]">Built for productivity.</span>
        </h1>
        <Link href="/auth/signin" className="mt-6 ">
          <Button className="text-md  py-7 px-10 bg-[#611f69] hover:bg-slack_dark_bg">
            GET STARTED
          </Button>
        </Link>
        <p className="text-md mt-4">
          Slack is free to try{" "}
          <span className="text-muted-foreground">
            for as long as you’d like
          </span>
        </p>
        <div className="flex justify-between md:flex-nowrap flex-wrap md:w-fit w-[80vw]  md:gap-10 gap-6 mt-10">
          <img
            src="/logo-airbnb-small.png"
            alt="airbnb"
            className=" w-[90px] h-[30px] md:w-[55%] md:h-[55%]"
          />
          <img
            src="/logo-nasa-small.png"
            alt="nasa"
            className=" w-[35px] h-[35px] md:w-[65%] md:h-[65%]"
          />

          <img
            src="/logo-uber-small.png"
            alt="airbnb"
            className=" w-[90px] h-[30px] md:w-[55%] md:h-[55%]"
          />
          <img
            src="/logo-target-small.png"
            alt="target"
            className=" w-[35px] h-[35px] md:w-[55%] md:h-[55%]"
          />
          <img
            src="/logo-nyt-small.png"
            alt="airbnb"
            className=" w-[100px] h-[30px] md:w-[55%] md:h-[55%]"
          />
          <img
            src="/logo-etsy-small.png"
            alt="airbnb"
            className=" w-[90px] h-[30px] md:w-[55%] md:h-[55%]"
          />
        </div>
        <video
          src="/vid.webm"
          className="2xl:w-[70%] xl:w-[80%] md:w-[90%] w-[90vw] mt-8 object-cover"
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
}
