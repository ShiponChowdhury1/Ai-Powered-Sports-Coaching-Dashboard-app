"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  Camera, 
  Bell, 
  Bold, 
  Italic, 
  Strikethrough, 
  Link, 
  Quote, 
  Code, 
  Image, 
  List, 
  ListOrdered,
  AlignLeft
} from "lucide-react";

type SettingsTab = "admin-info" | "change-password" | "notification" | "privacy-policy" | "terms";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("admin-info");
  const [adminInfo, setAdminInfo] = useState({
    fullName: "Admin User",
    email: "admin@luxestore.com",
    phone: "+1 (555) 000-0000",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    failedAIAnalysis: true,
    paymentFailures: true,
    highPriorityTickets: true,
    flaggedContent: true,
  });

  const menuItems = [
    { id: "admin-info" as SettingsTab, label: "Admin Information" },
    { id: "change-password" as SettingsTab, label: "Change Password" },
    { id: "notification" as SettingsTab, label: "Notification" },
    { id: "privacy-policy" as SettingsTab, label: "Privacy Policy" },
    { id: "terms" as SettingsTab, label: "trams & Conditions" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-full lg:w-80 bg-[#FFFFFF] rounded-xl p-4 lg:p-6 space-y-4 lg:space-y-6 h-fit shadow-sm border border-[#E5E7EB]">
        {/* Profile Section */}
        <div className="text-center space-y-3 lg:space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24 lg:w-32 lg:h-32">
              <AvatarImage src={adminInfo.profilePicture} alt="Admin" />
              <AvatarFallback>DW</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">Dexter Watts</h2>
            <p className="text-sm text-gray-600 mt-1">Update your store details and branding</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-emerald-600 text-white font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-lg p-4 sm:p-6 lg:p-8">
        {activeTab === "admin-info" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Information</h1>
              <p className="text-sm text-gray-600 mt-1">Update your store details and branding</p>
            </div>

            {/* Profile Picture Upload */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={adminInfo.profilePicture} alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full hover:bg-emerald-700 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Admin Information</h3>
                  <p className="text-sm text-gray-600">admin</p>
                  <p className="text-xs text-gray-500 mt-1">Click camera icon to upload profile picture</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-900 font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={adminInfo.fullName}
                  onChange={(e) =>
                    setAdminInfo({ ...adminInfo, fullName: e.target.value })
                  }
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={adminInfo.email}
                  onChange={(e) =>
                    setAdminInfo({ ...adminInfo, email: e.target.value })
                  }
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-900 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={adminInfo.phone}
                  onChange={(e) =>
                    setAdminInfo({ ...adminInfo, phone: e.target.value })
                  }
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button className="w-[226px] h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white px-[82px] py-[14px] rounded-xl">
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "change-password" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
              <p className="text-sm text-gray-600 mt-1">Update your password to keep your account secure</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-900 font-medium">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-900 font-medium">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full h-[45px] bg-[#F9FAFB] border-[#E5E7EB] rounded-xl px-4 py-3"
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button className="w-[226px] h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white px-[82px] py-[14px] rounded-xl">
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notification" && (
          <div className="space-y-6">
            {/* Notification Rules Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Notification Rules</h2>
              </div>

              <div className="space-y-4">
                {/* Failed AI Analysis */}
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Failed AI Analysis</h3>
                    <p className="text-sm text-gray-500">Notify when AI analysis fails</p>
                  </div>
                  <Switch
                    checked={notificationSettings.failedAIAnalysis}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, failedAIAnalysis: checked })
                    }
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                {/* Payment Failures */}
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Payment Failures</h3>
                    <p className="text-sm text-gray-500">Alert on failed payment transactions</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentFailures}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, paymentFailures: checked })
                    }
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                {/* High Priority Support Tickets */}
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">High Priority Support Tickets</h3>
                    <p className="text-sm text-gray-500">Immediate notification for urgent tickets</p>
                  </div>
                  <Switch
                    checked={notificationSettings.highPriorityTickets}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, highPriorityTickets: checked })
                    }
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                {/* Flagged Content */}
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Flagged Content</h3>
                    <p className="text-sm text-gray-500">Alert when videos are flagged</p>
                  </div>
                  <Switch
                    checked={notificationSettings.flaggedContent}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, flaggedContent: checked })
                    }
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy-policy" && (
          <div className="space-y-6">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                Edit
              </Button>
            </div>

            {/* Editor Toolbar */}
            <div className="bg-gray-100 rounded-lg p-2 flex items-center gap-1">
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 font-bold text-sm">H</button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 font-bold text-sm">B</button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Italic className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Strikethrough className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Link className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Quote className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Code className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Image className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-xs font-medium">NFT</button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><List className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><ListOrdered className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><AlignLeft className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-sm">1</button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-sm">?</button>
            </div>

            {/* Privacy Policy Content */}
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
                <p className="text-sm leading-relaxed">
                  Form-Cert SRL ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform and use our services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                
                <h3 className="font-bold text-gray-900 mb-2">Personal Data</h3>
                <p className="text-sm mb-2">We may collect personally identifiable information, such as:</p>
                <ul className="text-sm space-y-1 ml-0">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Professional information (job title, company, industry)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Course enrollment and progress data</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-gray-900 mb-2">Usage Data</h3>
                <p className="text-sm leading-relaxed">
                  We automatically collect information about your device and how you interact with our platform, including IP address, browser type, pages visited, time spent on pages, and other diagnostic data.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">6. Data Security</h2>
                <p className="text-sm leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">7. Data Retention</h2>
                <p className="text-sm leading-relaxed">
                  We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">8. Your Rights and Choices</h2>
                <p className="text-sm leading-relaxed">
                  You can update your account information, unsubscribe from marketing communications, or request deletion of your data by contacting us at privacy@form-cert.eu.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">10. Changes to This Policy</h2>
                <p className="text-sm leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">11. Contact Us</h2>
                <p className="text-sm mb-1">If you have questions about this Privacy Policy, please contact us:</p>
                <p className="text-sm text-emerald-600">Email: privacy@form-cert.eu</p>
                <p className="text-sm text-emerald-600">Address: Via Roma 123, 20121 Milano, Italy</p>
              </section>
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="space-y-6">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                Edit
              </Button>
            </div>

            {/* Editor Toolbar */}
            <div className="bg-gray-100 rounded-lg p-2 flex flex-wrap items-center gap-1">
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 font-bold text-sm">H</button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 font-bold text-sm">B</button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Italic className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Strikethrough className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Link className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Quote className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Code className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Image className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-xs font-medium">NFT</button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><List className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><ListOrdered className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><AlignLeft className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-sm">1</button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 text-sm">?</button>
            </div>

            {/* Terms & Conditions Content */}
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
                <p className="text-sm leading-relaxed">
                  Form-Cert SRL ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform and use our services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                
                <h3 className="font-bold text-gray-900 mb-2">Personal Data</h3>
                <p className="text-sm mb-2">We may collect personally identifiable information, such as:</p>
                <ul className="text-sm space-y-1 ml-0">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Professional information (job title, company, industry)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Course enrollment and progress data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">3.Usage Data</h2>
                <p className="text-sm leading-relaxed">
                  We automatically collect information about your device and how you interact with our platform, including IP address, browser type, pages visited, time spent on pages, and other diagnostic data.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Security</h2>
                <p className="text-sm leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">5. Data Retention</h2>
                <p className="text-sm leading-relaxed">
                  We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">6. Your Rights and Choices</h2>
                <p className="text-sm leading-relaxed">
                  You can update your account information, unsubscribe from marketing communications, or request deletion of your data by contacting us at privacy@form-cert.eu.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">7. Changes to This Policy</h2>
                <p className="text-sm leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
