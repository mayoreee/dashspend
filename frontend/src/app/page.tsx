import Footer from "@/components/footer";
import Main from "@/components/main";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function Home() {
  return (
    <>
      <main className="flex flex-col">
        <Main />
      </main>
      <Footer />
    </>
  );
}
