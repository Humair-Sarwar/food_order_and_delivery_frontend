import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Save, 
  Mail, 
  Phone,
  Percent,
  Truck,
  DollarSign,
  Sliders
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Defining precise types for the settings tabs
type TabId = 'general' | 'delivery' | 'payment' | 'notifications' | 'security';

interface SettingsTab {
  id: TabId;
  name: string;
  icon: LucideIcon;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [codStatus, setCodStatus] = useState<boolean>(true);
  const [digitalPaymentStatus, setDigitalPaymentStatus] = useState<boolean>(true);

  // Tab configurations matching project requirements
  const settingsTabs: SettingsTab[] = [
    { id: 'general', name: 'General Settings', icon: Building2 },
    { id: 'delivery', name: 'Delivery & Commission', icon: Truck },
    { id: 'payment', name: 'Payment Gateways', icon: CreditCard },
    { id: 'notifications', name: 'Notifications Alerts', icon: Bell },
    { id: 'security', name: 'System Security', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* HEADER ROW SECTION */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight sm:text-2xl">
            System Control Center
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            Configure business variables, delivery configurations, transactional policies, and project parameters.
          </p>
        </div>

        <button className="hidden sm:flex items-center gap-2 px-4 h-10 text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/10 transition-all active:scale-98 cursor-pointer">
          <Save className="w-4 h-4" />
          <span>Save Framework Changes</span>
        </button>
      </div>

      {/* MAIN INTERACTIVE SETTINGS GRID LAYOUT */}
      <div className="grid gap-6 md:grid-cols-4 items-start">
        
        {/* LEFT COLUMN: Tabs Navigation */}
        <div className="flex flex-col gap-1 bg-white border border-gray-200/80 p-2 rounded-2xl shadow-sm md:col-span-1">
          {settingsTabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TabIcon className="w-4 h-4 shrink-0" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Settings Dynamic Panels */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm md:col-span-3 p-6">
          
          {/* TAB 1: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-gray-800">Platform Credentials</h3>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">Primary identifier variables for application interfaces.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Business Name</label>
                  <input 
                    type="text" 
                    defaultValue="StackFood Delivery Inc."
                    className="w-full h-10 px-3.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-gray-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Global System Tax (%)</label>
                  <div className="relative">
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      type="number" 
                      defaultValue="5"
                      className="w-full h-10 pl-3.5 pr-10 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Support Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      type="email" 
                      defaultValue="support@stackfood.com"
                      className="w-full h-10 pl-10 pr-3.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-gray-700"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Hotline Helpline Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      defaultValue="+92 300 1234567"
                      className="w-full h-10 pl-10 pr-3.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="flex items-center justify-between p-4 bg-amber-500/[0.02] border border-amber-500/10 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-800">System Maintenance Lock</span>
                  <span className="text-[11px] font-bold text-gray-400 mt-0.5">Isolate database writes and route frontends to a temporary landing frame.</span>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    maintenanceMode ? 'bg-amber-500' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DELIVERY & COMMISSION REQUIREMENTS */}
          {activeTab === 'delivery' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-gray-800">Delivery Logic & Commission Matrices</h3>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">Define constraints, multi-zone shipping multipliers, and restaurant revenue cuts.</p>
              </div>

              {/* Delivery Costing Config Parameters */}
              <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-orange-500" />
                  <span>Shipping Cost Structure</span>
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Base Delivery Charge</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input type="number" defaultValue="2.50" className="w-full h-9 pl-8 pr-3 text-xs font-semibold bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Delivery Per KM Rate</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input type="number" defaultValue="0.75" className="w-full h-9 pl-8 pr-3 text-xs font-semibold bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Free Delivery Minimum</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input type="number" defaultValue="30.00" className="w-full h-9 pl-8 pr-3 text-xs font-semibold bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Constraints Setup */}
              <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-orange-500" />
                  <span>Cart & Validation Constraints</span>
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Minimum Order Value</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input type="number" defaultValue="10.00" className="w-full h-9 pl-8 pr-3 text-xs font-semibold bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Max Items Allowed Per Cart</label>
                    <input type="number" defaultValue="15" className="w-full h-9 px-3 text-xs font-semibold bg-white border border-gray-200 rounded-lg outline-none focus:border-orange-500" />
                  </div>
                </div>
              </div>

              {/* Admin Platform Commission System Rule */}
              <div className="bg-orange-500/[0.02] border border-orange-500/10 p-4 rounded-2xl space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-orange-500" />
                    <span>Admin Platform Commission Split</span>
                  </span>
                  <span className="text-[11px] font-bold text-gray-400 mt-0.5">The fixed cutoff fee percentage automated during payout calculations for each processed vendor checkout.</span>
                </div>
                <div className="max-w-[200px] relative">
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input type="number" defaultValue="15" className="w-full h-10 pl-3.5 pr-10 text-xs font-semibold bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT GATEWAYS */}
          {activeTab === 'payment' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-gray-800">Transactional Route Modules</h3>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">Toggle and calibrate currency ingestion streams.</p>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs">COD</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">Cash On Delivery (COD)</span>
                    <span className="text-[11px] font-bold text-gray-400 mt-0.5">Allow shoppers to settle bills via courier upon delivery.</span>
                  </div>
                </div>
                <button
                  onClick={() => setCodStatus(!codStatus)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    codStatus ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    codStatus ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">CC</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-800">Digital Card / Wallet Infrastructure</span>
                    <span className="text-[11px] font-bold text-gray-400 mt-0.5">Process digital cards via integrated Square or Stripe endpoints.</span>
                  </div>
                </div>
                <button
                  onClick={() => setDigitalPaymentStatus(!digitalPaymentStatus)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    digitalPaymentStatus ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    digitalPaymentStatus ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-gray-800">Automated Messaging Logs</h3>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">Control live operational dispatch triggers.</p>
              </div>
              <p className="text-xs font-semibold text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                Push notifications mapping and Twilio SMS routing configurations can be evaluated directly inside this module layout.
              </p>
            </div>
          )}

          {/* TAB 5: SYSTEM SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-black text-gray-800">System Security Firewall</h3>
                <p className="text-[11px] font-bold text-gray-400 mt-0.5">Manage token frequencies and session expirations.</p>
              </div>
              <p className="text-xs font-semibold text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                Administrative security authentication configurations, role access logs, and password expiry rules can be integrated directly here.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Sticky Save Button */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40">
        <button className="flex items-center gap-2 px-5 py-3 text-xs font-black bg-orange-500 text-white rounded-xl shadow-xl shadow-orange-500/20 active:scale-95 transition-all cursor-pointer">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

    </div>
  );
}