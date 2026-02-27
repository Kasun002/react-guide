"use client";

import { Tabs } from "@/components/Tabs";

export default function TabsDemo() {
  return (
    <div className="space-y-10">

      {/* ── Demo 1: Settings panel ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Demo — Settings Panel
        </p>

        {/* Clean consumer API — no callbacks, no activeTab prop to thread through */}
        <Tabs defaultTab="profile">
          <Tabs.List>
            <Tabs.Tab id="profile">Profile</Tabs.Tab>
            <Tabs.Tab id="security">Security</Tabs.Tab>
            <Tabs.Tab id="billing">Billing</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel id="profile">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Profile Settings</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Display name" placeholder="Jane Smith" />
                <Field label="Email" placeholder="jane@acme.com" />
                <Field label="Role" placeholder="Senior Engineer" />
                <Field label="Location" placeholder="San Francisco, CA" />
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel id="security">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Security Settings</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Current password" placeholder="••••••••" />
                <Field label="New password" placeholder="••••••••" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="rounded" defaultChecked />
                Enable two-factor authentication
              </label>
            </div>
          </Tabs.Panel>

          <Tabs.Panel id="billing">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Billing Settings</h3>
              <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                Current plan: <strong>Pro</strong> · $29 / month
              </div>
              <Field label="Card number" placeholder="•••• •••• •••• 4242" />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>

      {/* ── Demo 2: Two independent instances — each has its own Context state ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Two independent instances (each owns its own state)
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <Tabs defaultTab="a">
            <Tabs.List>
              <Tabs.Tab id="a">Tab A</Tabs.Tab>
              <Tabs.Tab id="b">Tab B</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel id="a"><p className="text-sm text-gray-600">Panel A content</p></Tabs.Panel>
            <Tabs.Panel id="b"><p className="text-sm text-gray-600">Panel B content</p></Tabs.Panel>
          </Tabs>

          <Tabs defaultTab="x">
            <Tabs.List>
              <Tabs.Tab id="x">Tab X</Tabs.Tab>
              <Tabs.Tab id="y">Tab Y</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel id="x"><p className="text-sm text-gray-600">Panel X content</p></Tabs.Panel>
            <Tabs.Panel id="y"><p className="text-sm text-gray-600">Panel Y content</p></Tabs.Panel>
          </Tabs>
        </div>
      </div>

    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
  );
}
