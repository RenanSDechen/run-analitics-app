import { SignupFlowProvider } from '../../context/SignupFlowContext'

// Este layout envolve /signup/page.tsx, /signup/step2/page.tsx, etc.
export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Carrega o Provider para que todos os 'children' (as páginas)
    // possam acessar o mesmo estado.
    <SignupFlowProvider>
      <div className="relative flex h-auto min-h-screen w-full flex-col font-display dark overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 py-5 md:px-20 lg:px-40 flex flex-1 justify-center">
            <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
              {children} {/* Aqui é onde a página (Step 1) será renderizada */}
            </div>
          </div>
        </div>
      </div>
    </SignupFlowProvider>
  )
}