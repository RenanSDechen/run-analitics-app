'use client' // Importante adicionar isso agora, pois temos estado (useState)

import { useState } from 'react'
import Link from 'next/link'
import { FeatureCard } from '@/components/landing/FeatureCard'
import { Button } from '@/components/ui/Button'
import { LandingHeader } from '@/components/landing/LandingHeader' // Novo
import { LoginModal } from '@/components/landing/LoginModal' // Novo

export default function LandingPage() {
  // Estado para controlar o modal
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <div className="relative flex h-auto w-full flex-col group/design-root overflow-x-hidden bg-background-dark">
      
      {/* --- O MODAL FICA AQUI --- */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <div className="layout-container flex h-full grow flex-col">
        
        {/* --- O HEADER NOVO ENTRA AQUI --- */}
        <LandingHeader onLoginClick={() => setIsLoginOpen(true)} />

        {/* === Hero Section === */}
        <div className="px-4 py-5 md:px-10 lg:px-40">
          <div className="layout-content-container mx-auto flex max-w-[960px] flex-1 flex-col">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col items-center justify-center gap-6 rounded-xl bg-cover bg-center bg-no-repeat p-4 @[480px]:gap-8"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6SjozkBjLAP6AVa5mSL28z1audCYVWeryANcjwSLN-NGpfrgZckLOGSGsBFJKiGiTBmceqF9sahrjTPaZnbmm7ShgDhPNu6RY3biLVAVSf8pK2kNEhQvHUMHD0lzwZE_geDVZOIGRAjAsuVOSHK62fCPgogDZG-rshXTZFi52IT5ZT15l65kdrkWN4EgZ0V7TRgCejg_c9T2ZvD5MePiBbvicuyo7iIlVU-MUOLicGAfRzZz9039YkiYIwO68ecofv3hiAvxmATM")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-center justify-center">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Pare de Apenas Correr. Comece a Treinar.
                    </h1>
                    <h2 className="max-w-2xl text-sm font-normal leading-normal text-white @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Receba planos de treino inteligentes, acompanhe seu
                      progresso e atinja seus objetivos, seja nos 5km ou em um
                      Ironman.
                    </h2>
                  </div>
                  
                  <Button href="/signup" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-on-primary transition-colors h-10 hover:bg-primary/80 @[480px]:h-12 @[480px]:px-5 @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                    <span className="truncate">
                      Experimente 2 Treinos Grátis
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ... (O RESTANTE DA PÁGINA: Features, How It Works, Pricing, Footer) CONTINUA IGUAL ... */}
        {/* ... Mantenha todo o código abaixo inalterado ... */}
        {/* === Feature Section === */}
        <div className="px-4 py-5 md:px-10 lg:px-40">
          {/* ... (Conteúdo Features) ... */}
          <div className="layout-content-container mx-auto flex max-w-[960px] flex-1 flex-col">
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col items-start gap-4">
                <h1 className="max-w-[720px] text-[32px] font-bold leading-tight tracking-tight text-white @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  A Ferramenta Definitiva para Atletas de Performance
                </h1>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 p-0">
                <FeatureCard icon="auto_awesome" title="Planos Inteligentes">
                  Receba um plano de treino gerado para sua meta, sua rotina e seu esporte.
                </FeatureCard>
                <FeatureCard icon="timeline" title="Progresso Visual">
                  Acompanhe cada treino e veja claramente sua evolução em direção ao seu objetivo.
                </FeatureCard>
                <FeatureCard icon="directions_run" title="Controle de Equipamentos">
                  Monitore a vida útil dos seus tênis e equipamentos para treinar com segurança.
                </FeatureCard>
              </div>
            </div>
          </div>
        </div>

        {/* === How It Works Section === */}
        <div className="px-4 py-5 md:px-10 lg:px-40">
           {/* ... (Conteúdo How It Works) ... */}
           <div className="layout-content-container mx-auto flex max-w-[960px] flex-1 flex-col">
            <h2 className="px-4 pb-3 pt-5 text-center text-[28px] font-bold leading-tight tracking-[-0.015em] text-white">
              Sua Jornada Começa em 3 Passos
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 p-4">
              <FeatureCard icon="flag" title="1. Defina Seu Objetivo" align="center">
                "Correr uma Meia Maratona em 12 semanas"
              </FeatureCard>
              <FeatureCard icon="event_available" title="2. Receba Seu Plano" align="center">
                Receba um plano semanal detalhado na tela.
              </FeatureCard>
              <FeatureCard icon="check_circle" title="3. Treine e Acompanhe" align="center">
                Marque treinos como concluídos e veja seu progresso.
              </FeatureCard>
            </div>
          </div>
        </div>

        {/* === Pricing & Trial Offer Section === */}
        <div className="px-4 py-16 md:px-10 lg:px-40">
           {/* ... (Conteúdo Pricing) ... */}
           <div className="layout-content-container mx-auto flex max-w-[640px] flex-1 flex-col">
            <div className="flex flex-col items-center gap-6 rounded-xl border border-solid border-card-border bg-card-bg p-8 text-center">
              <h1 className="text-3xl font-bold leading-tight text-white">
                Comece Sua Evolução Hoje
              </h1>
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-bold leading-tight text-primary">
                  Teste Gratuitamente
                </p>
                <p className="max-w-md text-base font-normal leading-normal text-text-light">
                  Cadastre-se e use o gerador de planos para criar e acompanhar
                  seus 2 primeiros treinos sem custo algum.
                </p>
              </div>
              <p className="text-lg font-normal leading-normal text-white">
                Após o teste, o acesso completo custa apenas{' '}
                <span className="font-bold text-primary">
                  R$19,90 por mês.
                </span>
              </p>
              <Button href="/signup" className="w-full text-text-on-primary">
                Criar Conta e Iniciar Teste Gratuito
              </Button>
              <p className="max-w-md text-sm font-normal leading-normal text-card-text-light opacity-80">
                Seu apoio é o combustível que nos permite continuar melhorando a
                plataforma para você.
              </p>
            </div>
          </div>
        </div>

        {/* === Footer === */}
        <div className="px-4 py-5 md:px-10 lg:px-40">
          <div className="layout-content-container mx-auto flex max-w-[960px] flex-1 flex-col">
            <div className="flex items-center justify-center gap-6 border-t border-card-border p-4">
              <Link className="text-sm text-card-text-light transition-colors hover:text-primary" href="/contato">
                Contato
              </Link>
              <Link className="text-sm text-card-text-light transition-colors hover:text-primary" href="/termos">
                Termos de Serviço
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}