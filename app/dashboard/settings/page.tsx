"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Shield,
  Link,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Mait Club",
    siteDescription: "AI-powered sports coaching platform",
    maintenanceMode: false,
    supportEmail: "support@sportcoach.ai",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReport: true,
    alertOnFailure: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordPolicy: "strong",
    ipWhitelist: false,
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    stripeEnabled: true,
    stripeKey: "sk_live_****",
    googleAnalyticsId: "GA-XXXXX",
    slackWebhook: "",
    sendgridEnabled: true,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage application settings and configurations"
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Link className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        supportEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      siteDescription: e.target.value,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">
                    Enable to show maintenance page to users
                  </p>
                </div>
                <Switch
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setGeneralSettings({
                      ...generalSettings,
                      maintenanceMode: checked,
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        pushNotifications: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Report</p>
                    <p className="text-sm text-gray-500">
                      Receive weekly analytics summary
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        weeklyReport: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alert on AI Failures</p>
                    <p className="text-sm text-gray-500">
                      Get notified when AI processing fails
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.alertOnFailure}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        alertOnFailure: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-500">
                      Receive product updates and offers
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        marketingEmails: checked,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">
                    Require 2FA for all admin accounts
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: checked,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <Select
                    value={securitySettings.passwordPolicy}
                    onValueChange={(value) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordPolicy: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="strong">
                        Strong (12+ with special chars)
                      </SelectItem>
                      <SelectItem value="very-strong">
                        Very Strong (16+ with all types)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">IP Whitelist</p>
                  <p className="text-sm text-gray-500">
                    Restrict admin access to specific IPs
                  </p>
                </div>
                <Switch
                  checked={securitySettings.ipWhitelist}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({
                      ...securitySettings,
                      ipWhitelist: checked,
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure third-party service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stripe */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Stripe Payments</p>
                    <p className="text-sm text-gray-500">
                      Enable Stripe payment processing
                    </p>
                  </div>
                  <Switch
                    checked={integrationSettings.stripeEnabled}
                    onCheckedChange={(checked) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        stripeEnabled: checked,
                      })
                    }
                  />
                </div>
                {integrationSettings.stripeEnabled && (
                  <div className="space-y-2 pl-4 border-l-2 border-[#E5E7EB]">
                    <Label>Stripe API Key</Label>
                    <Input
                      type="password"
                      value={integrationSettings.stripeKey}
                      onChange={(e) =>
                        setIntegrationSettings({
                          ...integrationSettings,
                          stripeKey: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
              <Separator />

              {/* Google Analytics */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Google Analytics ID</Label>
                  <Input
                    value={integrationSettings.googleAnalyticsId}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        googleAnalyticsId: e.target.value,
                      })
                    }
                    placeholder="GA-XXXXX"
                  />
                </div>
              </div>
              <Separator />

              {/* Slack */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Slack Webhook URL</Label>
                  <Input
                    value={integrationSettings.slackWebhook}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        slackWebhook: e.target.value,
                      })
                    }
                    placeholder="https://hooks.slack.com/..."
                  />
                  <p className="text-sm text-gray-500">
                    Receive notifications in Slack
                  </p>
                </div>
              </div>
              <Separator />

              {/* SendGrid */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SendGrid Email</p>
                  <p className="text-sm text-gray-500">
                    Use SendGrid for transactional emails
                  </p>
                </div>
                <Switch
                  checked={integrationSettings.sendgridEnabled}
                  onCheckedChange={(checked) =>
                    setIntegrationSettings({
                      ...integrationSettings,
                      sendgridEnabled: checked,
                    })
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
