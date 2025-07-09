import { logo } from "../assets";
import { BackgroundLines } from "./ui/background-lines";

const Hero = () => {
  return (
    <header
      className="w-full flex justify-center
    items-center flex-col"
    >
      <nav className="flex justify-between w-full items-center mb-10 pt-3">
        <img src={logo} alt="Summerize_logo" className=" w-44 object-contain" />

        <a
          href="https://www.theguardian.com/europe"
          target="_blank"
          className="purple_btn"
        >
          News
        </a>
      </nav>
      <BackgroundLines svgOptions={{ duration: 15 }}>
        <h1 className="head_text z-40">
          Summarize Articles using <br className="max-md:hidden" />
          <span className="purple_gradient">The Power of AI</span>
        </h1>

        <h2 className="desc">
          Save time and acquire more knowledge by optimizing your reading with
          Summerize, an article summarizer that uses AI to create straight to
          the point text summaries
        </h2>
      </BackgroundLines>
    </header>
  );
};

export default Hero;
