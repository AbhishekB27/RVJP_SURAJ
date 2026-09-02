import Footer from "@/components/footer";
import Header from "@/components/header";
import SmoothScroll from "@/components/smooth-scroll";

/** Chrome shared by every public page. `/admin` sits outside this group. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <Header />
      {children}
      <Footer />
    </>
  );
}
