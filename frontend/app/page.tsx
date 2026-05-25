import type { Metadata } from "next"
import { LoginForm } from "@/app/login/login-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Login | HSS Manager",
  description: "Sign in to your school workspace.",
}

const TRANSLATIONS = {
  english: {
    title: "The Art of Quiet Order",
    content: [
      "A school shouldn't be defined by the weight of its ledgers, but by the lightness of its leadership.",
      "HSS Manager dissolves the friction of daily operations, weaving student records, staff payroll, and academic milestones into a single, intuitive flow.",
      "Step away from the chaos of fragmented systems and embrace a workspace built for the future of education."
    ]
  },
  malayalam: {
    title: "അറിവിന്റെ വെളിച്ചം",
    content: [
      "ഒരു വിദ്യാലയത്തിന്റെ ശക്തി അതിന്റെ ഭാരമേറിയ കണക്കുപുസ്തകങ്ങളിലല്ല, മറിച്ച് സുതാര്യമായ തീരുമാനങ്ങളിലാണ്.",
      "അഡ്മിഷൻ മുതൽ അക്കാദമിക് നേട്ടങ്ങൾ വരെ, ഓരോ വിദ്യാർത്ഥിയുടെയും വളർച്ചയെ അതിലളിതമായും കൃത്യമായും ഈ സംവിധാനം ഏകോപിപ്പിക്കുന്നു",
      "ഫയലുകൾക്കിടയിലെ നൂലാമാലകൾ ഉപേക്ഷിക്കൂ; വിദ്യാലയ ഭരണരംഗത്തെ പുതിയൊരു പ്രഭാതത്തിലേക്ക് ചുവടുവയ്‌ക്കു."
    ]
  }
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans">
      {/* Left Panel: Multilingual Content */}
      <div className="hidden h-full w-1/2 flex-col justify-center bg-slate-50 px-16 lg:flex border-r border-slate-100">
        <Tabs defaultValue="english" className="w-full max-w-2xl">
          <TabsList className="mb-12 inline-flex h-10 items-center justify-center rounded-lg bg-slate-200/50 p-1 text-slate-500">
            <TabsTrigger value="english" className="rounded-md px-6 py-1.5 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm">English</TabsTrigger>
            <TabsTrigger value="malayalam" className="rounded-md px-6 py-1.5 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm">മലയാളം</TabsTrigger>
          </TabsList>

          {Object.entries(TRANSLATIONS).map(([key, data]) => (
            <TabsContent key={key} value={key} className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-5xl font-bold tracking-tight text-slate-900 font-geist-sans leading-[1.1]">
                {data.title}
              </h2>
              <div className="space-y-6">
                {data.content.map((paragraph, index) => (
                  <p key={index} className="text-xl text-slate-600 leading-relaxed font-medium">
                    {paragraph}
                  </p>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-20 border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-tight">
            <span className="size-2 rounded-full bg-slate-900" />
            <span>HSS MANAGER 2026</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="flex h-full w-full flex-col justify-center px-4 sm:px-6 md:px-12 lg:w-1/2 lg:px-24 xl:px-32 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-geist-sans">
              Welcome Back
            </h1>
            <p className="mt-3 text-lg text-slate-500 font-medium">
              Access your dashboard to manage school operations.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}