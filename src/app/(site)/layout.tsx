import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[30%] w-[600px] h-[600px]
          rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px]
          rounded-full bg-blue-600/8 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px]
          rounded-full bg-violet-800/6 blur-[80px]" />
      </div>

      <Navbar />
      <main className="min-h-screen w-full">{children}</main>
      <Footer />
    </>
  )
}
