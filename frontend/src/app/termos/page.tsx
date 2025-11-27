'use client'

import { useRouter } from 'next/navigation'

export default function TermsOfServicePage() {
  const router = useRouter()

  return (
    // Usamos o padding/margin do layout raiz
    <div className="relative flex min-h-screen w-full flex-col font-display dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 py-10 md:px-20 lg:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
            
            {/* Cabeçalho */}
            <div className="flex justify-between items-center gap-4 p-4 mb-4">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Termos de Uso e Serviço
              </h1>
              <button
                onClick={() => router.back()} // Botão para voltar
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-button-secondary-bg text-white text-sm font-bold hover:bg-button-secondary-hover transition-colors"
              >
                <span className="truncate">Voltar</span>
              </button>
            </div>

            {/* Conteúdo Legal */}
            <div className="flex flex-col gap-8 p-4 text-form-placeholder prose prose-invert">
              <p className="text-sm">Última atualização: 15 de novembro de 2025</p>

              <p>
                Bem-vindo ao RunAnalitics. Estes Termos de Uso ("Termos") regem
                seu acesso e uso de nossa plataforma de treinamento, incluindo
                quaisquer aplicativos móveis, websites, software e serviços
                associados (coletivamente, a "Plataforma").
              </p>
              <p>
                <strong>
                  AO ACESSAR, USAR OU CRIAR UMA CONTA NA PLATAFORMA, VOCÊ ESTÁ
                  CONCORDANDO COM ESTES TERMOS E CELEBRANDO UM CONTRATO
                  VINCULANTE CONOSCO. SE VOCÊ NÃO CONCORDA COM ESTES TERMOS, NÃO
                  USE A PLATAFORMA.
                </strong>
              </p>

              {/* Seção 1: Contas de Usuário */}
              <h2 className="text-white text-2xl font-bold mt-4">
                1. Contas de Usuário e Elegibilidade
              </h2>
              <p>
                Você deve ter pelo menos 18 anos de idade para criar uma conta e
                usar a Plataforma. Você concorda em fornecer informações
                verdadeiras, precisas e completas durante o registro e em manter
                essas informações atualizadas. Você é o único responsável por
                toda a atividade que ocorre em sua conta e pela manutenção da
                confidencialidade de sua senha.
              </p>

              {/* Seção 2: Pagamentos (Rigorosa) */}
              <h2 className="text-white text-2xl font-bold mt-4">
                2. Pagamentos, Faturamento e Assinaturas
              </h2>
              <p>
                <strong>a. Faturamento:</strong> Oferecemos serviços baseados em
                assinatura (planos mensais, anuais). Ao fornecer um método de
                pagamento, você nos autoriza (ou ao nosso processador de
                pagamento terceirizado) a cobrar de você a taxa de assinatura
                especificada, bem como quaisquer outros impostos e taxas
                aplicáveis.
              </p>
              <p>
                <strong>b. Renovação Automática:</strong> Para garantir um
                serviço ininterrupto, sua assinatura será renovada
                automaticamente no final do período de faturamento, a menos que
                você a cancele.
              </p>
              <p>
                <strong>c. Alterações de Preço:</strong> Reservamo-nos o direito
                de alterar nossas taxas de assinatura. Notificaremos você com
                pelo menos 30 (trinta) dias de antecedência sobre quaisquer
                alterações de preço.
              </p>
              <p>
                <strong>d. Política de Não Reembolso:</strong> TODOS OS PAGAMENTOS
                SÃO FINAIS E NÃO REEMBOLSÁVEIS. Não oferecemos reembolsos ou
                créditos por períodos de assinatura parcialmente utilizados,
                testes gratuitos não utilizados ou por qualquer motivo, exceto
                quando exigido por lei.
              </p>

              {/* Seção 3: Privacidade e LGPD (Rigorosa) */}
              <h2 className="text-white text-2xl font-bold mt-4">
                3. Privacidade de Dados e Lei Geral de Proteção de Dados (LGPD)
              </h2>
              <p>
                Nossa coleta e uso de suas informações pessoais e dados de
                treinamento são regidos pela nossa{' '}
                <a
                  href="/politica-de-privacidade"
                  className="text-primary hover:underline"
                >
                  Política de Privacidade
                </a>
                , que é incorporada a estes Termos por referência.
              </p>
              <p>
                <strong>a. Conformidade com a LGPD:</strong> Declaramos que a
                Plataforma opera em conformidade com a Lei nº 13.709/2018 (Lei
                Geral de Proteção de Dados Pessoais - LGPD) e outras legislações
                de proteção de dados aplicáveis.
              </p>
              <p>
                <strong>b. Consentimento:</strong> Ao aceitar estes Termos, você
                declara ciência e concede seu consentimento explícito para a
                coleta, tratamento e armazenamento de seus dados pessoais (como
                email, nome) e dados pessoais sensíveis (como dados de saúde,
                frequência cardíaca, peso, métricas de desempenho físico)
                necessários para a execução dos serviços da Plataforma.
              </p>
              <p>
                <strong>c. Sigilo e Confidencialidade:</strong> Comprometemo-nos a
                manter o mais estrito sigilo sobre todos os seus dados. Não
                iremos vender, alugar ou compartilhar seus dados pessoais com
                terceiros para fins de marketing sem seu consentimento explícito.
                Os dados podem ser processados de forma anônima para fins
                estatísticos e de melhoria da plataforma.
              </p>
              <p>
                <strong>d. Seus Direitos:</strong> Você tem o direito de
                acessar, corrigir, anonimizar ou solicitar a exclusão de seus
                dados, conforme detalhado em nossa Política de Privacidade.
              </p>

              {/* Seção 4: Isenção de Risco (Rigorosa) */}
              <h2 className="text-white text-2xl font-bold mt-4">
                4. ISENÇÃO DE RESPONSABILIDADE MÉDICA E RISCO DE ATIVIDADE FÍSICA
              </h2>
              <p>
                <strong>A PLATAFORMA NÃO OFERECE ACONSELHAMENTO MÉDICO.</strong>
              </p>
              <p>
                As atividades físicas e esportes de endurance (como corrida,
                ciclismo, natação e triathlon) são atividades inerentemente
                arriscadas que podem resultar em lesões graves, incapacidade ou
                morte.
              </p>
              <p>
                Você declara e garante que consultou um profissional de saúde
                qualificado antes de iniciar qualquer plano de treinamento gerado
                pela Plataforma e que está fisicamente apto para participar de
_                tais atividades. Você assume total responsabilidade por todos os
                riscos, danos ou lesões, conhecidos ou desconhecidos, que
                possam ocorrer como resultado do uso da Plataforma.
              </p>
              <p>
                O RunAnalitics não se responsabiliza por quaisquer lesões ou
                problemas de saúde que você possa sofrer como resultado do uso de
                nossos planos de treinamento.
              </p>

              {/* Seção 5: Conduta do Usuário */}
              <h2 className="text-white text-2xl font-bold mt-4">
                5. Propriedade Intelectual e Conduta do Usuário
              </h2>
              <p>
                Todo o conteúdo da Plataforma (incluindo software, logotipos,
                algoritmos de treinamento e design) é de propriedade exclusiva
                do RunAnalitics. Você não pode fazer engenharia reversa,
                copiar, modificar ou distribuir nosso conteúdo.
              </p>
              <p>
                Você nos concede uma licença mundial, não exclusiva e isenta de
                royalties para usar os dados que você carrega (seus "Dados de
                Usuário") com o único propósito de operar, melhorar e
                personalizar o serviço para você.
              </p>

              {/* Seção 6: Rescisão */}
              <h2 className="text-white text-2xl font-bold mt-4">
                6. Rescisão
              </h2>
              <p>
                Reservamo-nos o direito de suspender ou rescindir sua conta, a
                nosso exclusivo critério, com ou sem aviso prévio, por qualquer
                motivo, incluindo, entre outros, a violação destes Termos ou o
                não pagamento das taxas de assinatura.
              </p>

              {/* Seção 7: Disposições Gerais */}
              <h2 className="text-white text-2xl font-bold mt-4">
                7. Disposições Gerais
              </h2>
              <p>
                Estes Termos constituem o acordo integral entre você e o
                RunAnalitics. Reservamo-nos o direito de modificar estes Termos a
                qualquer momento. Notificaremos sobre alterações materiais, e seu
                uso continuado da Plataforma após tais alterações constituirá
                aceitação dos novos Termos.
              </p>
              <p>
                Estes Termos serão regidos pelas leis da República Federativa do
                Brasil, e qualquer disputa será resolvida no foro da comarca de
                [Sua Cidade/Estado], Brasil.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}