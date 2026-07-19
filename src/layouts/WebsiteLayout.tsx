import { Outlet } from "react-router-dom";
import { Header } from "../components/website/Header";
import { Footer } from "../components/website/Footer";
import WhatsAppButton from "../components/website/WhatsAppChat";
import { ChatWidget } from "../components/website/ChatWidget";

const WebsiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton/>
      <ChatWidget/>
    </div>
  );
};

export default WebsiteLayout;
