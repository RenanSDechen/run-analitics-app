'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSignupFlow } from '@/context/SignupFlowContext'
import { ProgressBar } from '@/components/signup/ProgressBar'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { PasswordStrengthMeter } from '@/components/signup/PasswordStrengthMeter'
import { Turnstile } from '@marsidev/react-turnstile'

export default function SignupRegisterPage() {
  const router = useRouter()
  const { flowData } = useSignupFlow()
  const [captchaToken, setCaptchaToken] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- VALIDAÇÃO DE FLUXO ---
  // Se o usuário caiu aqui de paraquedas sem preencher o plano,
  // mandamos ele voltar para o início.
  useEffect(() => {
    if (!flowData.sport || !flowData.goal) {
      router.replace('/signup')
    }
  }, [flowData, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!captchaToken) {
      setError("Por favor, verifique que você não é um robô.")
      return
    }
    // Validação básica de senha
    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setIsLoading(true)

    // Monta o DTO garantindo os tipos corretos
    const registrationDto = {
      name,
      email,
      password,
      planDetails: {
        sport: flowData.sport,
        goal: flowData.goal,
        // Garante que weeks seja número (caso venha string do range input)
        weeks: Number(flowData.weeksToTrain), 
        workoutsPerWeek: flowData.workoutsPerWeek,
      },
      captchaToken: captchaToken,
    }

    try {
      console.log('ENVIANDO...', registrationDto)
      
      // Chama a API Real
      const response = await fetch('http://localhost:8081/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationDto),
      })

      // Tratamento de Erro da API (ex: Email duplicado)
      if (!response.ok) {
        // Tenta ler como texto (ex: "Este email já está em uso")
        // Se não for texto, tenta ler o JSON de erro padrão do .NET
        const errorText = await response.text()
        try {
            const errorJson = JSON.parse(errorText)
            throw new Error(errorJson.title || errorText)
        } catch {
            throw new Error(errorText || 'Erro ao criar conta')
        }
      }

      const data = await response.json()
      
      // Sucesso: Salva e Redireciona
      localStorage.setItem('run_token', data.token)
      localStorage.setItem('run_userid', data.userId)
      localStorage.setItem('run_username', data.name)

      router.push('/dashboard')
      
    } catch (err: any) {
      console.error(err)
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-4">
      <ProgressBar currentStep={3} totalSteps={3} />

      <div className="flex flex-col gap-2">
        <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Salve Seu Plano
        </p>
        <p className="text-form-placeholder text-base font-normal leading-normal">
          Crie sua conta para acessar seu plano e acompanhar seu progresso.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          
          {/* Nome */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              id="name"
              placeholder="Como devemos te chamar?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative w-full">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-form-placeholder cursor-pointer hover:text-white transition-colors"
                tabIndex={-1} // Evita foco no botão ao dar Tab
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <PasswordStrengthMeter password={password} />
          </div>
          
          {/* Confirmar Senha */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirme sua Senha</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex justify-center my-4">
          <Turnstile 
            siteKey="1x00000000000000000000AA" // Chave de Teste da Cloudflare (Sempre Passa)
            onSuccess={(token) => setCaptchaToken(token)}
            options={{ theme: 'dark' }} // Combina com seu tema
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        <div className="flex justify-stretch mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex min-w-[84px] w-full max-w-[480px] mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 bg-primary text-text-on-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg shadow-primary/10"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-xl">
                  progress_activity
                </span>
                <span>Criando conta...</span>
              </div>
            ) : (
              <span className="truncate">Registrar e Acessar Dashboard</span>
            )}
          </button>
        </div>
      </form>

      <div className="text-center flex flex-col gap-4 border-t border-form-border pt-6">
        <p className="text-xs text-form-placeholder">
          Ao se cadastrar, você concorda com nossos{' '}
          <Link className="underline hover:text-primary transition-colors" href="/termos">
            Termos de Serviço
          </Link>
          .
        </p>
        <p className="text-sm text-white">
          Já tem uma conta?{' '}
          <Link className="font-bold text-primary hover:underline transition-colors" href="/login">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}