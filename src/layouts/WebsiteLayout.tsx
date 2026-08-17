import { Outlet } from "react-router-dom";
import { Header } from "../components/website/Header";
import { Footer } from "../components/website/Footer";
import WhatsAppButton from "../components/website/WhatsAppChat";
// import { ChatWidget } from "../components/website/ChatWidget";
import { useWebsiteSettings } from "../hooks/website/useFoodItems";

const WebsiteLayout = () => {
  const {
    data: settingsResponse,
    isLoading,
    isError,
  } = useWebsiteSettings();

  const settings: any = settingsResponse?.data;
  return (
    <div className="flex flex-col min-h-screen">
      <Header settings={settings}/>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer settings={settings}/>
      {(settings?.whatsapp_enabled && settings?.whatsapp_number) && <WhatsAppButton data={settings}/>}
      
      {/* <ChatWidget/> */}
    </div>
  );
};

export default WebsiteLayout;
